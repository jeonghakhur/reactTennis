import React, { useState }from 'react'
import { db } from '../firebase'
import { ref, update, remove } from 'firebase/database'

const Members = ({member}) => {
  const {id, name} = member
  const [ memberName, setMemberName ] = useState(name)

  const handleChangeInput = e => {
    const { value } = e.target
    setMemberName(value)
  }

  const handleClickUpdate = (id, memberName) => {
    update(ref(db, 'reactTennis/members/' + id), {
      name: memberName
    })
  }

  const handleClickDelete = id => {
    remove(ref(db, 'reactTennis/members/' + id))
  }

  return (
    <div>
      <input type="text" name="memberName" value={memberName} onChange={handleChangeInput} />
      <button type="button" onClick={() => {
        handleClickUpdate(id, memberName)
      }}>수정</button>
      <button type="button" onClick={() => {
        handleClickDelete(id)
      }}>삭제</button>
    </div>
  )
}

export default Members