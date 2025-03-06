import { useEffect, useState } from "react"
import { Select, MenuItem, TextField, Button } from '@mui/material'

export default function Home() {
  const [name, setName] = useState('')

  useEffect(() => {
    localStorage.setItem('name', name)
  }, [name])

  const handleChangeName = (event) => {
    setName(event.target.value)
  }

  const handleNext = () => {
    window.location.href = '/bet'
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
          >
            <MenuItem value="tina">Tina</MenuItem>
            <MenuItem value="alice">Alice</MenuItem>
            <MenuItem value="ben">Ben</MenuItem>
          </Select>
        </div>

        <Button variant="contained"
          sx={{ width: '50%', backgroundColor: '#ffbf25', marginTop: '20px' }}
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
