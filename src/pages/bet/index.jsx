import { useEffect, useState } from "react"
import { Select, MenuItem, TextField, Button } from '@mui/material'

export default function Home() {
  const [voteName, setVoteName] = useState('')
  const [userName, setUserName] = useState(0)
  const [bet, setBet] = useState(0)
  const [record, setRecord] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let name = localStorage.getItem('name')
    setUserName(name)
    getRecord(name)
  }, [])

  const getRecord = async (name) => {
    const response = await fetch(`/api/getRecord?name=${name}`)
    const data = await response.json()
    setRecord(data)
  }

  const handlePatchBets = async () => {
    if (!record?.data?.userName) {
      alert('用戶不存在')
      return
    }

    if (!voteName || !bet) {
      alert('請填寫完整下注信息')
      return
    }

    if (bet > record.data.remainingBets) {
      alert('下注次數已用完')
      return
    }

    setIsLoading(true)
    
    try {
      const insertResponse = await fetch(`/api/insertBets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: record.data.userName,
          vote_name: voteName,
          bet_amount: Number(bet),
        }),
      })
      
      if (!insertResponse.ok) {
        throw new Error('下注記錄新增失敗')
      }
      
      const patchResponse = await fetch(`/api/patchBets`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: record.data.userName,
          vote_name: voteName,
          bet_amount: Number(bet),
        }),
      })
      
      if (!patchResponse.ok) {
        throw new Error('更新下注資訊失敗')
      }

      alert('下注成功！')
      setVoteName('')
      setBet(0)

      getRecord(userName)

    } catch (error) {
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeVoteName = (event) => {
    setVoteName(event.target.value)
  }

  const handleChangeBet = (event) => {
    setBet(event.target.value)
  }

  return (
    <div className="container">
      <div className="title">下注下注</div>

      <div className="form-container">
        <div className="form-row">
          <div className="form-label">下注對象</div>
          <Select
            id="select-name"
            size="small"
            value={voteName}
            onChange={handleChangeVoteName}
            sx={{ width: '50%' }}
          >
            <MenuItem value="tina">Tina</MenuItem>
            <MenuItem value="alice">Alice</MenuItem>
            <MenuItem value="ben">Ben</MenuItem>
          </Select>
        </div>

        <div className="form-row">
          <div className="form-label">下注金額</div>
          <TextField
            id="bet"
            size="small"
            type="number"
            value={bet}
            onChange={handleChangeBet}
            sx={{ width: '50%' }}
          />
        </div>

        <Button 
          variant="contained"
          sx={{ width: '100%', backgroundColor: '#ffbf25' }}
          onClick={handlePatchBets}
          disabled={isLoading}
        >
          {isLoading ? '處理中...' : '我要下注'}
        </Button>

        <div className="flex flex-col items-left w-full">
          <div className="text-[#C4C4C4] mb-[10px]">
            剩餘下注次數：
            {record && record.data ? record.data.remainingBets : '-'}
          </div>
          <div className="mb-[10px]">下注統計</div>
          <div className="bg-[#F5F5F5] rounded-[10px] p-[10px]">
            {
              record && record.data && record.data.bettingStatistics.map((item, index) => (
                <div key={index}>{item.vote_name}：{item.total_bet_amount || '-'}</div>
              ))
            }
          </div>
        </div>

        <div className="flex flex-col items-left w-full">
          <div className="mb-[10px]">賠率</div>
          <div className="bg-[#F5F5F5] rounded-[10px] p-[10px]">
            {
              record && record.data && record.data.odds.map((item, index) => (
                <div key={index}>{item.user_name}：{item.total_vote_ratio || '-'}</div>
              ))
            }
          </div>
        </div>

      </div>




    </div>
  );
}
