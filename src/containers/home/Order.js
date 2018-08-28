import * as React from 'react'
import {
	DragSource
} from 'react-dnd'
import flow from 'lodash/flow'

const style = {
	border: '1px dashed gray',
	padding: '0.5rem 1rem',
	marginRight: '1.5rem',
	marginBottom: '1.5rem',
	cursor: 'move',
	float: 'left',
	width: 160
}

const boxSource = {
	beginDrag(props) {
		return props.order
	},
}

class Order extends React.Component {
	render() {
		const { order, isDropped, isDragging, connectDragSource, key } = this.props
		const opacity = isDragging ? 0.4 : 1
		const backgroundColor = order.color

		return (
			connectDragSource &&
			connectDragSource(
				<div key={key} style={{ ...style, opacity, backgroundColor }}>
					{order.orderType} ({order.quantity}D)
				</div>
			)
		)
	}
}

export default flow([DragSource((props) => props.order.orderType,
	boxSource,
	(connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
	}))])(Order);

