import * as React from 'react'
import {
	DragSource
} from 'react-dnd'
import flow from 'lodash/flow'

import { orderColors } from './constants'
import TooltipTemplate from './TooltipTemplate'

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
	constructor (props) {
		super(props)
		this.state = {
			tooltip: false
		}
	}

	render() {
		const { order, isDragging, connectDragSource, index } = this.props
		const opacity = isDragging ? 0.4 : 1

		return (<div onMouseEnter={(() => this.setState({tooltip:true}))} onMouseLeave={(() => this.setState({tooltip:false}))} style={{position: 'relative'}}>
			{ this.state.tooltip && <TooltipTemplate rows={[
				{title: 'Client', value: order.client},
				{title: 'Quantity', value: order.quantity},
				{title: 'Start', value: order.startDate},
				{title: 'End', value: order.endDate}
			]} /> }
			{connectDragSource &&
				connectDragSource(
					<div style={{ 
						width: order.days * 38 + 'px', 
						flexShrink: '0', 
						textAlign: 'center', 
						height: '2rem',
						borderRight: '1px solid #000' ,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: '12px',
						backgroundColor: orderColors[order.orderId],
						marginLeft: order.dateDiff * 38 + 'px'
					}} key={index}>
					{order.orderType}</div>
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
	}))])(OrderInLane);

