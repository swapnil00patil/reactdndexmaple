import * as React from 'react'
import { DropTarget } from 'react-dnd'
import flow from 'lodash/flow'
import OrderInLane from './OrderInLane'

const style = {
	height: '3rem',
	marginRight: '1.5rem',
	marginBottom: '1.5rem',
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
		const droppingItem = monitor.getItem()
		let initialValue = 0
		const daysInLane = lane.orders.length > 0 ? lane.orders.reduce((accum, current) => accum + current.days, initialValue) : 0
		return (daysInLane + droppingItem.days) <= totaldays
	},
}

class ProductionLane extends React.Component {
	render() {
		const {
			isOver,
			canDrop,
			connectDropTarget,
			lane,
			totaldays
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
			connectDropTarget(<div style={{ ...style, backgroundColor, width: totaldays * 38 + 'px' }}>
				{lane.orders.map((order, index) => <OrderInLane index={index} order={order} /> )}
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