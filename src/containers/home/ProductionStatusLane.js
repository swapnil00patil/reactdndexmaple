import * as React from 'react'
import { orderColors } from './constants'

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

		return <div key={index} style={{ ...style, backgroundColor, width: totaldays * 38 + 'px' }}>
			{lane.orders && lane.orders.map((order, index) => {
				const days = (Math.round(order.completedQty / lane['current-capacity']))
				return days !== 0 && <div style={{
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
				}} key={index}>({order.completedQty} / {order.plannedQty})</div>
			}
			)}
		</div>
	}
}

export default ProductionStatusLane;