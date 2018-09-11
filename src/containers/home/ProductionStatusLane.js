import * as React from 'react'
import { orderColors } from './constants'
import TooltipTemplate from './TooltipTemplate'

const style = {
	height: '1rem',
	marginRight: '1.5rem',
	marginBottom: '1rem',
	color: 'white',
	textAlign: 'center',
	fontSize: '1rem',
	lineHeight: 'normal',
	display: 'flex',
}

class ProductionStatusLane extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			tooltip: false
		}
	}

	render() {
		const {
			lane,
			totaldays,
			index
		} = this.props
		const isActive = true

		let backgroundColor = '#222'
		if (isActive) {
			backgroundColor = 'lightgray'
		}
		return <div key={index} style={{ ...style, backgroundColor, width: totaldays * 38 + 'px' }}>
			{lane.orders && lane.orders.map((order, index) => {
				const days = (Math.round(order.completedQty / lane['current-capacity']))
				return days !== 0 &&
					<div style={{
						width: days * 38 + 'px',
						flexShrink: '0',
						textAlign: 'center',
						height: '1rem',
						borderRight: '1px solid #000',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: '12px',
						backgroundColor: orderColors[order.orderId],
						marginLeft: order.dateDiff * 38 + 'px',
						position: 'relative'
					}} key={index} onMouseEnter={(() => this.setState({tooltip:true}))} onMouseLeave={(() => this.setState({tooltip:false}))}>
					{ this.state.tooltip && <TooltipTemplate rows={[
						{title: 'Client', value: order.client},
						{title: 'Completed', value: order.completedQty},
						{title: 'Planned', value: order.plannedQty},
						{title: 'Start', value: order.startDate},
						{title: 'End', value: order.endDate},
						{title: 'Capacity', value: lane['current-capacity']}
					]} /> }
						{Math.round((order.completedQty/order.plannedQty)*100)}%
					</div>
			}
			)}
		</div>
	}
}

export default ProductionStatusLane;