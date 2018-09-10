import * as React from 'react'

class TooltipTemplate extends React.Component {
	render() {
		const { rows } = this.props

		return (
			<div className="tooltiptext">
				{rows.map((row) => <div style={{ display: 'flex' }}>
					<div style={{ width: 90 }}>{row.title}:</div>
					<div style={{}}>{row.value}</div>
				</div>)}
			</div>
		)
	}
}

export default TooltipTemplate;

