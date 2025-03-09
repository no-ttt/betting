import { useEffect, useState } from "react"
import { Select, MenuItem, Checkbox, Button } from '@mui/material'

export default function Home() {
  const [name, setName] = useState('')
  const [plus1, setPlus1] = useState(false)
  const [plus2, setPlus2] = useState(false)
  const [plus3, setPlus3] = useState(false)
  const [options, setOptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    localStorage.setItem('name', name)

    fetch('/api/getName')
      .then(res => res.json())
      .then(data => {
        setOptions(data.data.allName)
        setIsLoading(false)
      })
  }, [name])

  if (isLoading) {
    return <div>Loading...</div>
  }

  const handleChangeName = (event) => {
    setName(event.target.value)
  }

  const handleNext = async () => {
    await fetch('/api/patchPlus', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_name: name,
        plus1: Boolean(plus1),
        plus2: Boolean(plus2),
        plus3: Boolean(plus3)
      })
    })

    window.location.href = '/bet'
  }

  const handleChangePlus1 = (event) => {
    setPlus1(event.target.checked)
  }

  const handleChangePlus2 = (event) => {
    setPlus2(event.target.checked)
  }

  const handleChangePlus3 = (event) => {
    setPlus3(event.target.checked)
  }

  return (
    <div className="container">
      <div className="title">下注入口</div>

      <div className="form-container">
        <div className="form-row">
          <div className="form-label">你是誰</div>
          <Select
            id="select-name"
            size="small"
            value={name}
            onChange={handleChangeName}
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
            {options.map((option, index) => (
              <MenuItem key={index} value={option.user_name}>
                {option.user_name.charAt(0).toUpperCase() + option.user_name.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </div>

        <Button variant="contained"
          sx={{ width: '50%', backgroundColor: '#ffbf25', marginTop: '10px', marginBottom: '10px' }}
          onClick={handleNext}
        >
          Next
        </Button>
      </div>

      <div className="rules-container mt-[30px] text-sm">
        <div className="flex flex-row items-center gap-2">
          <span className="text-[16px] font-bold">玩法說明</span>
          <span className="text-sm text-red-500">＊當其他人下注時，賠率會隨之變動</span>
        </div>
        <div>1. <span className="font-bold">每個人最多會有 100 注，每注 10 元</span>，為了避免沒有人要下注導致開發者白做此系統，所以至少要下 10 注</div>
        <div>2. 下注是浮動的，所以當其他人下注時，賠率會隨之變動，重整畫面就可以看到最新的賠率</div>
        <div>3. 下注時，請選擇要下注的人，並輸入注數，按下注按鈕即可</div>
        <div>4. 可以下注不同的人，直到下滿 100 注為止</div>
      </div>

      <div className="rules-container mt-[30px] text-sm">
        <div className="flex flex-row items-center gap-2">
          <span className="text-[16px] font-bold">來點大人的玩法</span>
          <span className="text-sm text-red-500">＊你不玩別人，不代表不會有人玩你 (勾選加入)</span>
        </div>
        <div className="flex flex-row gap-2">
          <Checkbox 
            onChange={handleChangePlus1}
            checked={plus1}
            size="small"
          />
          <div>
            <div className="font-bold">我是賭神 (下注全中)</div>
            <div>可以指定某人喝掉 5 杯 shot</div>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <Checkbox 
            onChange={handleChangePlus2}
            checked={plus2}
            size="small"
          />
          <div>
            <div className="font-bold">你太讓我失望了 (All-in)</div>
            <div>被壓的人如果沒有及格要喝 5 杯 shot</div>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <Checkbox 
            onChange={handleChangePlus3}
            checked={plus3}
            size="small"
          />
          <div>
            <div className="font-bold">等價交換</div>
            <div>我用 3 杯 shot 壓你贏，贏的話全部的人喝 6 杯 shot</div>
          </div>
        </div>
      </div>
    </div>
  );
}

