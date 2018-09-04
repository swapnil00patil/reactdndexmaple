import * as React from 'react'

class TooltipTemplate extends React.Component {
	render() {
		const { rows } = this.props

		return (
			rows.map((row) => <div style={{display:'flex'}}>
				<div style={{width:80}}>{row.title}:</div>
				<div style={{}}>{row.value}</div>
			</div>)
		)
	}
}

export default TooltipTemplate;

