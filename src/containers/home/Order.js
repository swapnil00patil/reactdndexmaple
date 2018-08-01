import * as React from 'react'
import {
	DragSource
} from 'react-dnd'
import flow from 'lodash/flow'

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

class Order extends React.Component {
	render() {
		const { order, isDropped, isDragging, connectDragSource } = this.props
		const opacity = isDragging ? 0.4 : 1

		return (
			connectDragSource &&
			connectDragSource(
				<div style={{ ...style, opacity }}>
					{order.name}
				</div>
			)
		)
	}
}

export default flow([DragSource((props) => props.order.type,
	boxSource,
	(connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
	}))])(Order);

