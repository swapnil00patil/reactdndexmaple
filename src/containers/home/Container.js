import React, { Component } from 'react'

import { DragDropContext } from 'react-dnd'
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend'
import moment from 'moment'
import axios from 'axios'

import ProductionLane from './ProductionLane'
import Order from './Order'
import ItemTypes from './ItemTypes'
const update = require('immutability-helper')

const style = {
  width: 400,
}
const baseUrl = "http://localhost:9080/";

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
        { id: 1, name: 'Order 1', type: ItemTypes.ORDER, days: 3, color: this.getRandomColor() },
        { id: 2, name: 'Order 2', type: ItemTypes.ORDER, days: 6, color: this.getRandomColor() },
        { id: 3, name: 'Order 3', type: ItemTypes.ORDER, days: 5, color: this.getRandomColor() },
        { id: 4, name: 'Order 4', type: ItemTypes.ORDER, days: 6, color: this.getRandomColor() },
        { id: 5, name: 'Order 5', type: ItemTypes.ORDER, days: 5, color: this.getRandomColor() },
        { id: 6, name: 'Order 6', type: ItemTypes.ORDER, days: 10, color: this.getRandomColor() },
        { id: 7, name: 'Order 7', type: ItemTypes.ORDER, days: 25, color: this.getRandomColor() },
      ],
      // only to maintian id
      totalOrders: 7,
      droppedOrders: [],
    }
    this.handleDrop = this.handleDrop.bind(this)
    this.getRandomColor = this.getRandomColor.bind(this)
    this.createNewOrder = this.createNewOrder.bind(this)
    this.getApis = this.getApis.bind(this);
  }

  componentWillMount () {
    // this.getApis();
  }

  getApis () {
    let apis = ['loadingPlan', 'lanes',  'orders', 'productionStatus'];
    apis.forEach((api) => {
      axios.get(baseUrl + api + '.json')
      .then((response) => {
        // handle success
        const res = JSON.parse(JSON.stringify(response.data));
        console.log(res[api]);
        this.setState({[api]: res[api]})
      });
    })
  }

  createNewOrder(days, item) {
    const { totalOrders } = this.state
    const orderID = totalOrders + 1
    this.setState({totalOrders: orderID})
    return { ...item, id: orderID, days: days}
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  handleDrop(dropIndex, item) {
    let newItem
    const droppedOrders = item ? { $push: [item] } : {}
    if(item.laneId) {
      item.originalDays = item.days
      const splitDays = Math.round(item.days / 2)
      newItem = this.createNewOrder(item.days - splitDays, item)
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
    console.log(this.state)
    return [<div style={{ display: 'flex', width: '100%', padding: '25px', background: 'grey', margin: '0 0 20px 0' }}> Production Line Master</div>,
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