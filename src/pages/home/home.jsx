
import React from 'react'
import { Table, Tag } from 'antd'

import './home.scss'

export default class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      data: [],
      columns: [
        {
          align: 'center',
          title: '日期',
          width: 150,
          dataIndex: 'tickertime',
          render (text) {
            return new Date(text)
              .toLocaleString()
              .split(' ')[0]
          }
        },
        {
          align: 'center',
          title: '开盘价($)',
          width: 150,
          dataIndex: 'openprice',
          render (num) {
            return num.toFixed(2)
          }
        },
        {
          align: 'center',
          title: '最高价($)',
          width: 150,
          dataIndex: 'high',
          render (num) {
            return num.toFixed(2)
          }
        },
        {
          align: 'center',
          title: '最低价($)',
          width: 150,
          dataIndex: 'low',
          render (num) {
            return num.toFixed(2)
          }
        },
        {
          align: 'center',
          title: '收盘价($)',
          width: 150,
          dataIndex: 'closeprice',
          render (num) {
            return num.toFixed(2)
          }
        },
        {
          align: 'center',
          title: '市值($)',
          width: 150,
          dataIndex: 'marketcap',
          render (num) {
            const yi = num / 100000000
            const wan = num / 10000
            if (yi > 0) return `${yi.toFixed(2)}亿`
            if (wan > 0) return `${yi.toFixed(2)}万`
            return num
          }
        },
        {
          align: 'center',
          title: '预测',
          width: 150,
          render: (row, _, index) => {
            const zuo = this.state.data[index + 1]
            const qian = this.state.data[index + 2]
            if (!zuo || !qian) return <Tag color="#b6b7ba">无数据</Tag>
            const zuoMark = zuo.marketcap
            const qianMark = qian.marketcap
            const percentage = this.getPercentage(zuoMark, qianMark)
            if (zuoMark > qianMark) return <div>
              <Tag color="#70b67e">涨</Tag>
              <Tag color="#70b67e">{percentage}</Tag>
            </div>
            return <div>
              <Tag color="#e6605c">跌</Tag>
              <Tag color="#e6605c">{percentage}</Tag>
            </div>
          }
        },
        {
          align: 'center',
          title: '日期',
          width: 150,
          dataIndex: 'tickertime',
          render (text) {
            return new Date(text)
              .toLocaleString()
              .split(' ')[0]
          }
        }
      ]
    }
  }

  componentDidMount () {
    this.getPrice({
      coincode: 'bitcoin',
      begintime: '20180101',
      endtime: this.getNowDate(),
      page: 1,
      per_page: 1000,
      webp: 1
    })
  }

  render () {
    return <div className="home">
      <div style={{ margin: 16, textAlign: 'center' }} onClick={this.toggleCoin.bind(this)}>
        <Tag color="magenta" data-code="bitcoin">BTC</Tag>
        <Tag color="red" data-code="ethereum">ETH</Tag>
        <Tag color="volcano" data-code="ripple">XRP</Tag>
        <Tag color="orange" data-code="litecoin">LTC</Tag>
        <Tag color="gold" data-code="bitcoin-cash">BCH</Tag>
        <Tag color="lime" data-code="eos">EOS</Tag>
        <Tag color="green" data-code="bitcoin-cash-sv">BSV</Tag>
        <Tag color="cyan" data-code="tron">TRX</Tag>
        <Tag color="blue" data-code="binance-coin">BNB</Tag>
        <Tag color="geekblue" data-code="ht">HT</Tag>
        <Tag color="purple" data-code="okb">OKB</Tag>
      </div>
      <Table
        bordered={true}
        loading={this.state.loading}
        columns={this.state.columns}
        dataSource={this.state.data}
        scroll={{ y: 800 }}
        pagination={{ defaultPageSize: 1000 }}
        rowKey={record => record.tickertime}
      />
    </div>
  }

  getPrice (params) {
    const paramsStr = '?' + this.warpParamsToUrl(params)

    this.setState({
      loading: true
    })

    fetch('https://dncapi.bqiapp.com/api/v3/coin/history' + paramsStr)
      .then(res => res.json())
      .then(res => this.setState({
        data: res.data.list
      }))
      .finally(() => this.setState({
        loading: false
      }))
  }

  warpParamsToUrl (params) {
    return Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&')
  }

  getPercentage (next, prev) {
    const dif = next - prev
    return (dif / prev * 100).toFixed(2) + '%'
  }

  toggleCoin (e) {
    const code = e.target.getAttribute('data-code')
    this.getPrice({
      coincode: code,
      begintime: '20180101',
      endtime: this.getNowDate(),
      page: 1,
      per_page: 1000,
      webp: 1
    })
  }

  getNowDate () {
    return new Date().toISOString()
      .substring(0,10)
      .split('-')
      .join('')
  }

}