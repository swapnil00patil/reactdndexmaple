import React, { Component } from 'react'

import { DragDropContext } from 'react-dnd'
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend'
import moment from 'moment'

import ProductionLane from './ProductionLane'
import Order from './Order'
import ItemTypes from './ItemTypes'
const update = require('immutability-helper')

const style = {
  width: 400,
}

class Container extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lanes: [
        { id: 1, accepts: [ItemTypes.ORDER], lastDroppedItem: null, orders: [] },
        { id: 2, accepts: [ItemTypes.ORDER], lastDroppedItem: null, orders: [] },
        { id: 3, accepts: [ItemTypes.ORDER], lastDroppedItem: null, orders: [] },
        { id: 4, accepts: [ItemTypes.ORDER], lastDroppedItem: null, orders: [] },
      ],
      orders: [
        { id: 1, name: 'Order 1', type: ItemTypes.ORDER, days: 3 },
        { id: 2, name: 'Order 2', type: ItemTypes.ORDER, days: 6 },
        { id: 3, name: 'Order 3', type: ItemTypes.ORDER, days: 5 },
        { id: 4, name: 'Order 4', type: ItemTypes.ORDER, days: 6 },
        { id: 5, name: 'Order 5', type: ItemTypes.ORDER, days: 5 },
        { id: 6, name: 'Order 6', type: ItemTypes.ORDER, days: 10 },
        { id: 7, name: 'Order 7', type: ItemTypes.ORDER, days: 25 },
      ],
      // only to maintian id
      totalOrders: 7,
      droppedOrders: [],
    }
    this.handleDrop = this.handleDrop.bind(this)
    this.createNewOrder = this.createNewOrder.bind(this)
  }

  createNewOrder(days) {
    const { totalOrders } = this.state
    const orderID = totalOrders + 1
    this.setState({totalOrders: orderID})
    return { id: orderID, name: 'Order ' + orderID, type: ItemTypes.ORDER, days: days}
  }

  handleDrop(dropIndex, item) {
    let newItem
    const droppedOrders = item ? { $push: [item] } : {}
    if(item.laneId) {
      item.originalDays = item.days
      const splitDays = Math.round(item.days / 2)
      newItem = this.createNewOrder(item.days - splitDays)
      item.days = splitDays

      this.setState(
        update(this.state, {
          lanes: {
            [dropIndex]: {
              lastDroppedItem: {
                $set: item,
              },
              orders: item || newItem ? { $push: [newItem || item] } : {}
            },
          },
          droppedOrders,
        }),
      )
    } else {
      item.laneId = this.state.lanes[dropIndex].id
      this.setState(
        update(this.state, {
          lanes: {
            [dropIndex]: {
              lastDroppedItem: {
                $set: item,
              },
              orders: item || newItem ? { $push: [newItem || item] } : {}
            },
          },
          droppedOrders,
          orders: {
            $splice: [
              [this.state.orders.findIndex(order => order.id === item.id), 1]
            ],
          },
        }),
      )
    }
  }

  render() {
    const { cards, lanes, orders } = this.state
    let totaldays = [...Array(30).keys()];
    // console.log(this.state)
    return [<div style={{ display: 'flex', width: '100%', padding: '25px', background: 'grey', margin: '0 0 20px 0' }}> Product Name</div>,
    <div style={{ display: 'flex' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '300px', padding: '0 0 0 25px' }}>
        {orders.map((order, index) => (
          <Order
            order={order}
            key={index}
          />
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div  style={{ display: 'flex', flexDirection: 'row' }}>
          {totaldays.map((day, index) => (
            <div style={{width: '38px', flexShrink: '0', textAlign: 'center', borderTop: '1px solid #ccc', borderRight: '1px solid #ccc'}} key={index}>
              {moment().add(index, 'days').format("MMM D")}
            </div>
          ))}
        </div>
        {lanes.map((lane, index) => (
          <ProductionLane
            onDrop={item => this.handleDrop(index, item)}
            key={index}
            lane={lane}
            accepts={lane.accepts}
            totaldays={totaldays.length}
          />
        ))}
      </div>
    </div>
    ]
  }
}

export default DragDropContext(HTML5Backend)(Container)