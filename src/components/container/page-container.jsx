import React from 'react'

const PageContainer = ({ children }) => {
  return (
     <section className="container py-16 space-y-8">{children}</section>
  )
}

export default PageContainer