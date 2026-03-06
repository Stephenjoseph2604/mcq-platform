import React from 'react'

const DotGrid = () => {
  return (
        <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
          radial-gradient(circle at 1px 1px, var(--color-text) 1px, transparent 0),
          radial-gradient(circle at 25px 25px, var(--color-text) 1px, transparent 0)
        `,
          backgroundSize: "50px 50px",
        }}
      />
  )
}

export default DotGrid
