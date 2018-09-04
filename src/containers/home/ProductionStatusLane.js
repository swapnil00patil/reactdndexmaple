import * as React from 'react'
import { orderColors } from './constants'
import Tooltip from 'rc-tooltip';
import TooltipTemplate from './TooltipTemplate'

const style = {
	height: '3rem',
	marginRight: '1.5rem',
	marginBottom: '1rem',
	color: 'white',
	textAlign: 'center',
	fontSize: '1rem',
	lineHeight: 'normal',
	display: 'flex',
}

class ProductionStatusLane extends React.Component {
	render() {
		const {
			lane,
			totaldays,
			index
		} = this.props
		const isActive = true

		let backgroundColor = '#222'
		if (isActive) {
			backgroundColor = 'darkgreen'
		}
console.log(lane.orders)
		return <div key={index} style={{ ...style, backgroundColor, width: totaldays * 38 + 'px' }}>
			{lane.orders && lane.orders.map((order, index) => {
				const days = (Math.round(order.completedQty / lane['current-capacity']))
				return days !== 0 && 
				<Tooltip trigger={['hover']} overlay={<TooltipTemplate rows={[
					{title: 'Client', value: order.client},
					{title: 'Completed', value: order.completedQty},
					{title: 'Planned', value: order.plannedQty},
					{title: 'Start', value: order.startDate},
					{title: 'End', value: order.endDate}
				]} />}>
					<div style={{
						width: days * 38 + 'px',
						flexShrink: '0',
						textAlign: 'center',
						height: '48px',
						borderRight: '1px solid #000',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: '12px',
						backgroundColor: orderColors[order.orderId],
						marginLeft: order.dateDiff * 38 + 'px',
					}} key={index}>
						{Math.round((order.completedQty/order.plannedQty)*100)}%
					</div>
				</Tooltip>
			}
			)}
		</div>
	}
}

export default ProductionStatusLane;