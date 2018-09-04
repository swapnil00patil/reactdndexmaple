import * as React from 'react'
import {
	DragSource
} from 'react-dnd'
import flow from 'lodash/flow'

import { orderColors } from './constants'

const style = {
	border: '1px dashed gray',
	backgroundColor: 'white',
	padding: '0.5rem 1rem',
	marginRight: '1.5rem',
	marginBottom: '1.5rem',
	cursor: 'move',
	float: 'left',
}

const boxSource = {
	beginDrag(props) {
		return props.order
	},
}

class OrderInLane extends React.Component {
	render() {
		const { order, isDragging, connectDragSource, index } = this.props
		const opacity = isDragging ? 0.4 : 1

		return (
			connectDragSource &&
			connectDragSource(
				<div style={{ 
					width: order.days * 38 + 'px', 
					flexShrink: '0', 
					textAlign: 'center', 
					height: '48px',
					borderRight: '1px solid #000' ,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: '12px',
					backgroundColor: orderColors[order.orderId],
					marginLeft: order.dateDiff * 38 + 'px', 
				}} key={index}>{order.orderType}</div>
			)
		)
	}
}

export default flow([DragSource((props) => props.order.orderType,
	boxSource,
	(connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
	}))])(OrderInLane);

