import { useEffect, useState } from "react"
import { Select, MenuItem, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

export default function Home() {
  const [voteName, setVoteName] = useState('')
  const [userName, setUserName] = useState(0)
  const [bet, setBet] = useState(0)
  const [record, setRecord] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [popup, setPopup] = useState(false)

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
      alert('超過剩餘下注次數')
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
      <div className="title">我要下注</div>

      <div className="form-container">
        <div className="form-row">
          <div className="form-label">下注對象</div>
          <Select
            id="select-name"
            size="small"
            value={voteName}
            onChange={handleChangeVoteName}
            sx={{ width: '50%' }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                },
              },
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
            }}
          >
            <MenuItem value="tom">Tom</MenuItem>
            <MenuItem value="alice">Alice</MenuItem>
            <MenuItem value="myra">Myra</MenuItem>
            <MenuItem value="tina">Tina</MenuItem>
            <MenuItem value="ben">Ben</MenuItem>
            <MenuItem value="hao">Hao</MenuItem>
            <MenuItem value="gary">Gary</MenuItem>
            <MenuItem value="michael">Michael</MenuItem>
            <MenuItem value="derrick">Derrick</MenuItem>
            <MenuItem value="jesse">Jesse</MenuItem>
            <MenuItem value="sheng">Sheng</MenuItem>
          </Select>
        </div>

        <div className="form-row">
          <div className="form-label">注數</div>
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
          <div className="flex flex-row justify-between">
            <div className="text-[#C4C4C4] mb-[10px]">
              剩餘下注次數：
              {record && record.data ? record.data.remainingBets : '-'}
            </div>
            <div className="text-[#ffbf25] underline cursor-pointer"
              onClick={() => {
                setPopup(true)
              }}
            >下注紀錄</div>
          </div>
        </div>

        <div className="flex flex-col items-left w-full">
          <div className="mb-[5px]">賠率</div>
          <div className="text-[red] text-[14px] mb-[10px]">(此為根據單一獲勝者情況下所計算的預期回報，實際的回報會根據最終的下注比例來調整)</div>
          
          <div className="bg-[#F5F5F5] rounded-[10px] p-[10px]">
            {
              record && record.data && record.data.odds.filter(item => item.user_name !== "wilson")
                .map((item, index) => (
                  <div key={index}>{item.user_name}：{item.total_vote_ratio || '-'}</div>
                ))
            }
          </div>
        </div>
      </div>

      <Dialog open={popup} onClose={() => setPopup(false)}
        PaperProps={{
          style: {
            width: '300px',
            maxHeight: '300px',
            overflow: 'auto',
          },
        }}
      >
        <DialogTitle>下注紀錄</DialogTitle>
        <DialogContent>
          <div className="bg-[#F5F5F5] rounded-[10px] p-[10px]">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">下注對象</th>
                  <th className="text-left">注數</th>
                  {/* <th className="text-right">預期收益(元)</th> */}
                </tr>
              </thead>
              <tbody>
                {
                  record && record.data && record.data.bettingStatistics.map((item, index) => {
                    const matchedOdd = record.data.odds.find(odd => odd.user_name === item.vote_name)
                    const totalVoteRatio = matchedOdd ? matchedOdd.total_vote_ratio : null

                    return (
                      <tr key={index}>
                        <td>{item.vote_name}</td>
                        <td className="text-left">{item.total_bet_amount || '-'}</td>
                        {/* <td className="text-right">{totalVoteRatio ? (item.total_bet_amount * totalVoteRatio).toFixed(2) * 10 : '-'}</td> */}
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
