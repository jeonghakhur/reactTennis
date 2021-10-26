import React, { useState, useEffect } from 'react'
import { db } from '../firebase'
import {
  onValue,
  ref,
  off,
  remove,
  child,
  get,
  set,
  update,
  query,
  limitToLast,
  orderByChild,
} from 'firebase/database'
import { useRouteMatch } from 'react-router-dom'

const ScheduleDetail = () => {
  const match = useRouteMatch()
  const key = match.params.name.trim()
  const [schedule, setSchedule] = useState()
  const [members, setMembers] = useState([])
  const [addMembers, setAddMembers] = useState([])

  const readData = () => {
    const scheduleRef = ref(db, '/reactTennis/schedule/' + key)
    onValue(scheduleRef, (snapshot) => {
      setSchedule(snapshot.val())
    })

    get(child(scheduleRef, 'members'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const newArray = []
          snapshot.forEach((child) => {
            newArray.push({
              id: child.key,
              ...child.val(),
            })
          })
          
          newArray.sort((a, b) => {
            const aId = Number(a.id)
            const bId = Number(b.id)
            if (aId > bId) {
              return -1
            }
            
          })

          setMembers(newArray)
          totalMember(newArray)
        } else {
          setMembers([])
          totalMember([])
        }
      })
      .catch((error) => {
        console.log(error)
      })

    return () => {
      off(scheduleRef)
    }
  }

  const totalMember = (members) => {
    const membersRef = query(ref(db, 'reactTennis/members'), orderByChild('name'))
    onValue(membersRef, snapshot => {
      const newArray = []
      snapshot.forEach(child => {
        newArray.push(child.val().name)
      })
      
      setAddMembers(newArray.filter(member => {
        return !members.find(val => val.name === member)
      }))
    })
  }

  useEffect(() => {
    const clean = readData()
    return clean
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClickDelete = (id) => {
    const deleteRef = ref(
      db,
      'reactTennis/schedule/' + key + '/members/' + [id]
    )
    remove(deleteRef)
      .then((data) => {
        readData('member remove')
      })
      .catch((error) => {
        console.log('delete error:', error)
      })
  }

  const handleOnChangeAccount = (e, id) => {
    const { value } = e.target
    setMembers(
      members.map((member) =>
        member.id === id ? { ...member, account: value } : member
      )
    )

    const updateRef = ref(db, `reactTennis/schedule/${key}/members/${id}`)
    update(updateRef, {
      account: value
    })
  }

  const handleChangeDesc = (e, id) => {
    const { value } = e.target
    setMembers(
      members.map((member) =>
        member.id === id ? { ...member, desc: value } : member
      )
    )

    const updateRef = ref(db, `reactTennis/schedule/${key}/members/${id}`)
    update(updateRef, {
      desc: value
    })
  }

  const handleChangeAddMember = e => {
    const {value} = e.target
    let newId = 0
    if (value === '0') return

    const lastMemberRef = query(ref(
      db,
      'reactTennis/schedule/' + key + '/members/'
    ), limitToLast(1))

    onValue(lastMemberRef, snapshot => {
      snapshot.forEach(child => {
        newId = Number(child.key) + 1
      })
    }, {
      onlyOnce: true
    })

    const addMemberRef = ref(
      db,
      'reactTennis/schedule/' + key + '/members/' + newId
    )

    set(addMemberRef, {
      account: 0,
      name: value,
      desc: '',
    }).then(() => readData())
  }

  return (
    <>
      {schedule ? (
        <div>
          <h1 className="page-title">
            {schedule.date}월 {schedule.day}요일 참석자
          </h1>
          <div className="member-add-wrap">
            <label className="label" htmlFor="addMember">참석자 추가</label>
            <select className="select" name="addMember" id="addMember" onChange={handleChangeAddMember}>
              <option value="0">선택</option>
              {addMembers.map(member => (<option value={member} key={member}>{member}</option>))}
            </select>
          </div>
          <table className="table">
            <thead>
              <tr>
                <td>번호</td>
                <td>이름</td>
                <td>회비</td>
                <td>비고</td>
                <td>삭제</td>
              </tr>
            </thead>
            <tbody>
              {members.map((member, idx) => (
                <tr key={member.id}>
                  <td>{members.length - idx}</td>
                  <td>{member.name}</td>
                  <td>
                    <select name="account" value={member.account} onChange={(e) => {
                        handleOnChangeAccount(e, member.id)
                      }}>
                      <option value="0">미납</option>
                      <option value="30000">30000</option>
                      <option value="20000">20000</option>
                    </select>
                  </td>
                  <td>
                    <input type="text" name="desc" value={member.desc} onChange={(e) => {
                      handleChangeDesc(e, member.id)
                    }}/>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => {
                        handleClickDelete(member.id)
                      }}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        '!Initialize!!!'
      )}
    </>
  )
}

export default ScheduleDetail
