import React, { Component } from 'react'

import { DragDropContext } from 'react-dnd'
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend'
import moment from 'moment'
import axios from 'axios'

import ProductionLane from './ProductionLane'
import ProductionStatusLane from './ProductionStatusLane'
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
    }
    this.handleDrop = this.handleDrop.bind(this)
    this.createNewOrder = this.createNewOrder.bind(this)
    this.getApis = this.getApis.bind(this);
    this.massageOrders = this.massageOrders.bind(this);
    this.massageLanes = this.massageLanes.bind(this);
    this.getCompleteQuantity = this.getCompleteQuantity.bind(this);
  }

  componentWillMount() {
    this.getApis();
  }

  componentDidMount () {
    var fullscreenButton = document.getElementById("fullscreen-button");
    var fullscreenDiv    = document.getElementById("fullscreen");
    var fullscreenFunc   = fullscreenDiv.requestFullscreen;

    if (!fullscreenFunc) {
      ['mozRequestFullScreen',
      'msRequestFullscreen',
      'webkitRequestFullScreen'].forEach(function (req) {
        fullscreenFunc = fullscreenFunc || fullscreenDiv[req];
      });
    }

    function enterFullscreen() {
      fullscreenFunc.call(fullscreenDiv);
    }

    fullscreenButton.addEventListener('click', enterFullscreen);
  }

  getApis() {
    let apis = ['lanes', 'orders', 'productionStatus'];
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

  massageOrders(orders) {
    return orders.map((order) => {
      return order;
    })
  }

  massageLanes(lanes) {
    return lanes.map((lane) => {
      lane.orders && lane.orders.map((order) => {
        order.days = Math.ceil(order.quantity / lane['current-capacity'])
      })
      return lane;
    })
  }

  createNewOrder(droppedLane, quantity, item) {
    const { totalOrders } = this.state
    const orderID = Number(totalOrders) + 1
    this.setState({ totalOrders: orderID })
    return { ...item, id: orderID, days: Math.ceil(quantity / droppedLane['current-capacity']), quantity: quantity, dateDiff: 0 }
  }

  getCompleteQuantity (planned) {
    let orderFound;
    this.state.productionStatus.some((production) => {
      return production.orders.some((order) => {
        orderFound = order;
        return order.orderId === planned.orderId;
      }) 
    })
    return (orderFound && orderFound.completedQty) || 0;
  }

  handleDrop(dropIndex, item) {
    let newItem
    const droppedOrders = item ? { $push: [item] } : {}
    if (item.laneId) {
      if (splitDays === 1) {
        alert('You cannot split single day work')
        return
      }
      
      const completedQty =  this.getCompleteQuantity(item);
      const completedDays =  Math.round(completedQty / item.laneCapacity);

      const splitQuantities = Math.round((item.quantity - completedQty) / 2)
      const splitDays = Math.round((item.days - completedDays) / 2)
      newItem = this.createNewOrder(this.state.lanes[dropIndex], (item.quantity - completedQty) - splitQuantities, item)
      console.log(newItem)
      item.days = splitDays + completedDays
      item.quantity = Number(splitQuantities) + Number(completedQty)

      this.setState(
        update(this.state, {
          lanes: {
            [dropIndex]: {
              orders: item || newItem ? { $push: [newItem || Object.assign({}, item)] } : {}
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
    const { lanes, orders, productionStatus } = this.state
    let totaldays = [-5, -4, -3, -2, -1, ...Array(25).keys()];

    return [<div style={{ display: 'flex', width: '100%', padding: '25px', background: 'grey', margin: '0 0 20px 0' }}> Production Line Master<button id="fullscreen-button">Enter Fullscreen</button></div>,
    <div style={{ display: 'flex', overflow: 'auto' }} id="fullscreen">
      <div style={{ display: 'flex', flexDirection: 'column', width: '300px', padding: '0 0 0 25px' }}>
        {orders && orders.map((order, index) => (
          <Order
            order={order}
            key={index}
          />
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'row', flexShrink: 0 }}>
          <div style={{ flexShrink: 0, paddingRight: 10, width: 60 }}></div>
          {totaldays.map((day, index) => (
            <div style={{ background: day === 0 ? 'green' : 'white', width: '38px', flexShrink: '0', textAlign: 'center', borderTop: '1px solid #ccc', borderRight: '1px solid #ccc' }} key={index}>
              {moment().add(day, 'days').format("MMM D")}
            </div>
          ))}
        </div>

        <div style={{display: 'flex', flexDirection: 'column', flexShrink: 0}}>
          {lanes && lanes.map((lane, index) => (
            [
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <div style={{ flexShrink: 0, paddingRight: 10, width: 60 }}>{lane.itemType}</div>
                <ProductionLane
                  onDrop={item => this.handleDrop(index, item)}
                  index={index}
                  lane={lane}
                  accepts={[lane.itemType]}
                  totaldays={totaldays.length}
                />
              </div>,
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <div style={{ flexShrink: 0, paddingRight: 10, width: 60 }}></div>
                {productionStatus.filter((status) => status.laneId === lane.laneId)
                  .map((lane) =>
                    <ProductionStatusLane
                      index={index}
                      lane={lane}
                      totaldays={totaldays.length}
                    />)}
              </div>
            ]
          ))}
        </div>
      </div>
    </div>
    ]
  }
}

export default DragDropContext(HTML5Backend)(Container)