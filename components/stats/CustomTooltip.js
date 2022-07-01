const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const total = payload.reduce(function (s, a) {
      return s + a.value
    }, 0)

    return (
        <div className="tooltip" style={{ backgroundColor: 'white', borderStyle: 'solid', borderWidth: '1px', padding: 3 }}>
          <p className="tooltipDesc">{`${payload[0]?.payload?.date}`}</p>
          <p className="tooltipDesc">{`Total: ${total}`}</p>
          {
            payload.map(payloadi => {
              return (<p key={payloadi.dataKey} style={{ color: payloadi.fill, margin: 3, paddingLeft: 10, paddingRight: 10 }}>
              {`${payloadi.dataKey}: ${payloadi.value}`}
            </p>)
            })
          }
        </div>
    )
  }

  return null
}

export default CustomTooltip
