import * as React from 'react'
import { DropTarget } from 'react-dnd'
import flow from 'lodash/flow'
import OrderInLane from './OrderInLane'

const style = {
	height: '2rem',
	marginRight: '1.5rem',
	marginBottom: '0.1rem',
	color: 'white',
	textAlign: 'center',
	fontSize: '1rem',
	lineHeight: 'normal',
	display: 'flex',
}

const dustbinTarget = {
	drop(props, monitor) {
		props.onDrop(monitor.getItem())
	},
	canDrop(props, monitor) {
		const { lane, totaldays } = props
		const order = monitor.getItem()
		const orderDays = Math.ceil(order.quantity / lane['current-capacity'])
		let initialValue = 0
		const daysInLane = (lane.orders && lane.orders.length > 0) ? lane.orders.reduce((accum, current) => accum + Math.round(current.quantity / lane['current-capacity']), initialValue) : 0
		return (daysInLane + orderDays) <= totaldays && lane.laneId !== order.laneId
	},
}

class ProductionLane extends React.Component {
	render() {
		const {
			isOver,
			canDrop,
			connectDropTarget,
			lane,
			totaldays,
			index
		} = this.props
		const isActive = isOver && canDrop

		let backgroundColor = '#222'
		if (isActive) {
			backgroundColor = 'darkgreen'
		} else if (canDrop) {
			backgroundColor = 'darkkhaki'
		}

		return (
			connectDropTarget &&
			connectDropTarget(<div key={index} style={{ ...style, backgroundColor, width: totaldays * 38 + 'px' }}>
				{lane.orders && lane.orders.map((order, index) => <OrderInLane index={index} order={order} /> )}
			</div>)
		)
	}
}

export default flow([DropTarget(
	props => props.accepts,
	dustbinTarget,
	(connect, monitor) => ({
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop(),
	}))])(ProductionLane);