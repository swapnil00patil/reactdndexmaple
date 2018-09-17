import * as React from 'react'
import {
	DragSource
} from 'react-dnd'
import flow from 'lodash/flow'
import { orderColors } from './constants'
import TooltipTemplate from './TooltipTemplate'

const style = {
	border: '1px dashed gray',
	padding: '0.5rem 1rem',
	marginRight: '1.5rem',
	marginBottom: '1.5rem',
	cursor: 'move',
	float: 'left',
	width: 160,
	color: 'white'
}

const boxSource = {
	beginDrag(props) {
		return props.order
	},
}

class Order extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			tooltip: false
		}
		this.bakeTooltip = this.bakeTooltip.bind(this);
	}

	bakeTooltip (order) {
		let data = [];
		data.push({ title: 'Client', value: order.client });
		if(order.orderDate) {
			data.push({ title: 'Order Date', value: order.orderDate });
		}
		if(order.deliveryDate) {
			data.push({ title: 'Delivery Date', value: order.deliveryDate });
		}
		if(order.startDate) {
			data.push({ title: 'Start Date', value: order.startDate });
		}
		if(order.endDate) {
			data.push({ title: 'End Date', value: order.endDate });
		}
		if(order.totalQuantity) {
			data.push({ title: 'Planned', value: order.totalQuantity });
		} else if(order.quantity) {
			data.push({ title: 'Quantity', value: order.quantity });
		}
		if(order.completedQuantity) {
			data.push({ title: 'Completed', value: order.completedQuantity });
		}
		data.push({ title: 'Order ID', value: order.orderId });
		return data;
	}

	render() {
		const { order, isDropped, isDragging, connectDragSource, key } = this.props
		const opacity = isDragging ? 0.4 : 1
		const backgroundColor = orderColors[order.orderId]
		return (<div onMouseEnter={(() => this.setState({ tooltip: true }))} onMouseLeave={(() => this.setState({ tooltip: false }))} style={{ position: 'relative' }}>
			{this.state.tooltip && <TooltipTemplate
			style={{top: 44 ,left: 0}} rows={this.bakeTooltip(order)} />}
			{connectDragSource &&
				connectDragSource(
					<div key={key} style={{ ...style, opacity, backgroundColor }}>
						{order.orderType} ({order.quantity}D)
				</div>
				)}
		</div>
		)
	}
}

export default flow([DragSource((props) => props.order.orderType,
	boxSource,
	(connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
	}))])(Order);

