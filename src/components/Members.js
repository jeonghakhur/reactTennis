import React from 'react'

const Members = ({member}) => {
  const {id, name} = member
  return (
    <>
      <div key={id}>
        <input type="text" name="name" value={name} />
        <button type="button">수정</button>
        <button type="button">삭제</button>
      </div>
    </>
  )
}

export default Members