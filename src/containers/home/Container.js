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
      // lanes: [
      //   { id: 1, accepts: [ItemTypes.ORDER], lastDroppedItem: null, orders: [] },
      //   { id: 2, accepts: [ItemTypes.ORDER], lastDroppedItem: null, orders: [] },
      //   { id: 3, accepts: [ItemTypes.ORDER], lastDroppedItem: null, orders: [] },
      //   { id: 4, accepts: [ItemTypes.ORDER], lastDroppedItem: null, orders: [] },
      // ],
      // orders: [
      //   { id: 1, name: 'Order 1', type: ItemTypes.ORDER, days: 3, color: this.getRandomColor() },
      //   { id: 2, name: 'Order 2', type: ItemTypes.ORDER, days: 6, color: this.getRandomColor() },
      //   { id: 3, name: 'Order 3', type: ItemTypes.ORDER, days: 5, color: this.getRandomColor() },
      //   { id: 4, name: 'Order 4', type: ItemTypes.ORDER, days: 6, color: this.getRandomColor() },
      //   { id: 5, name: 'Order 5', type: ItemTypes.ORDER, days: 5, color: this.getRandomColor() },
      //   { id: 6, name: 'Order 6', type: ItemTypes.ORDER, days: 10, color: this.getRandomColor() },
      //   { id: 7, name: 'Order 7', type: ItemTypes.ORDER, days: 25, color: this.getRandomColor() },
      // ],
      // // only to maintian id
      // totalOrders: 7,
      // droppedOrders: [],
    }
    this.handleDrop = this.handleDrop.bind(this)
    this.getRandomColor = this.getRandomColor.bind(this)
    this.createNewOrder = this.createNewOrder.bind(this)
    this.getApis = this.getApis.bind(this);
    this.massageOrders = this.massageOrders.bind(this);
    this.massageLanes = this.massageLanes.bind(this);
  }

  componentWillMount () {
    this.getApis();
  }

  getApis () {
    let apis = ['lanes',  'orders', 'productionStatus'];
    let promises = []
    apis.forEach((api) => {
      promises.push(
        new Promise((resolve, reject) => {
          axios.get(baseUrl + api + '.json')
          .then((response) => {
            // handle success
            const res = JSON.parse(JSON.stringify(response.data));
            resolve(res[api]);
          })
        })
      )
    })
    Promise.all(promises).then((values) => {
      this.setState({
        lanes: this.massageLanes(values[0]),
        orders: this.massageOrders(values[1]),
        productionStatus: values[2]
      })
    });
  }

  massageOrders (orders) {
    return orders.map((order) => {
      order.color = this.getRandomColor();
      return order;
    })
  }

  massageLanes (lanes) {
    return lanes.map((lane) => {
      lane.orders && lane.orders.map((order) => {
        order.color = this.getRandomColor();
        order.days = Math.ceil(order.quantity / lane['current-capacity'])
      })
      return lane;
    })
  }

  createNewOrder(days, quantity, item) {
    const { totalOrders } = this.state
    const orderID = totalOrders + 1
    this.setState({totalOrders: orderID})
    return { ...item, id: orderID, days: days, quantity: quantity}
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
      const splitDays = Math.round(item.days / 2)
      const splitQuantities = Math.round(item.quantity / 2)
      newItem = this.createNewOrder(item.days - splitDays, item.quantity - splitQuantities, item)
      item.days = splitDays
      item.quantity = splitQuantities

      this.setState(
        update(this.state, {
          lanes: {
            [dropIndex]: {
              orders: item || newItem ? { $push: [newItem || item] } : {}
            },
          }
        }),
      )
    } else {
      let droppedLane = this.state.lanes[dropIndex]
      item.laneId = droppedLane.laneId
      item.days = Math.ceil(item.quantity / droppedLane['current-capacity'])
      this.setState(
        update(this.state, {
          lanes: {
            [dropIndex]: {
              orders: item ? { $push: [item] } : {}
            },
          },
          orders: {
            $splice: [
              [this.state.orders.findIndex(order => order.orderId === item.orderId), 1]
            ],
          }
        }),
      )
    }
  }

  render() {
    const { lanes, orders } = this.state
    let totaldays = [-5, -4, -3, -2, -1, ...Array(30).keys()];
    console.log(this.state)
    return [<div style={{ display: 'flex', width: '100%', padding: '25px', background: 'grey', margin: '0 0 20px 0' }}> Production Line Master</div>,
    <div style={{ display: 'flex' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '300px', padding: '0 0 0 25px' }}>
        {orders && orders.map((order, index) => (
          <Order
            order={order}
            key={index}
          />
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div  style={{ display: 'flex', flexDirection: 'row' }}>
          {totaldays.map((day, index) => (
            <div style={{background: day === 0 ? 'green' : 'white', width: '38px', flexShrink: '0', textAlign: 'center', borderTop: '1px solid #ccc', borderRight: '1px solid #ccc'}} key={index}>
              {moment().add(day, 'days').format("MMM D")}
            </div>
          ))}
        </div>
        {lanes && lanes.map((lane, index) => (
          <ProductionLane
            onDrop={item => this.handleDrop(index, item)}
            index={index}
            lane={lane}
            accepts={[lane.itemType]}
            totaldays={totaldays.length}
          />
        ))}
      </div>
    </div>
    ]
  }
}

export default DragDropContext(HTML5Backend)(Container)