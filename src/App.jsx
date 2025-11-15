import { useState, useRef } from 'react'
import './App.css'

function App() {
  // 状态管理
  const [users, setUsers] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isDrawing, setIsDrawing] = useState(false)
  const [winner, setWinner] = useState('')
  const [history, setHistory] = useState([])
  const inputRef = useRef(null)

  // 添加用户
  const addUser = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue && !users.includes(trimmedValue)) {
      setUsers([...users, trimmedValue])
      setInputValue('')
      inputRef.current?.focus()
    }
  }

  // 处理回车添加用户
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addUser()
    }
  }

  // 移除用户
  const removeUser = (index) => {
    const newUsers = [...users]
    newUsers.splice(index, 1)
    setUsers(newUsers)
  }

  // 清空用户列表
  const clearUsers = () => {
    setUsers([])
    setWinner('')
  }

  // 抽奖函数
  const draw = async () => {
    if (users.length === 0 || isDrawing) return

    setIsDrawing(true)
    setWinner('')

    // 抽奖动画效果 - 快速切换显示不同用户
    const iterations = 30 // 动画迭代次数
    for (let i = 0; i < iterations; i++) {
      // 随着动画进行，延迟逐渐增加，创造减速效果
      const delay = 50 + i * 10
      await new Promise(resolve => setTimeout(resolve, delay))
      
      // 随机选择一个用户作为中间结果
      const randomIndex = Math.floor(Math.random() * users.length)
      setWinner(users[randomIndex])
    }

    // 最终选择获胜者 (确保每个用户有相等概率)
    const finalWinnerIndex = Math.floor(Math.random() * users.length)
    const finalWinner = users[finalWinnerIndex]
    setWinner(finalWinner)
    
    // 添加到历史记录
    const timestamp = new Date().toLocaleString()
    setHistory([{ name: finalWinner, time: timestamp }, ...history])
    
    setIsDrawing(false)
  }

  return (
    <div className="app-container">
      <h1 className="app-title">抽奖系统</h1>
      
      {/* 用户输入区域 */}
      <div className="input-section">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="请输入用户名"
          disabled={isDrawing}
          className="user-input"
        />
        <button onClick={addUser} disabled={isDrawing} className="add-button">
          添加用户
        </button>
      </div>

      {/* 用户列表区域 */}
      <div className="users-section">
        <h2>参与人员 ({users.length})</h2>
        {users.length > 0 && (
          <button onClick={clearUsers} disabled={isDrawing} className="clear-button">
            清空列表
          </button>
        )}
        <div className="users-list">
          {users.map((user, index) => (
            <div key={index} className="user-item">
              <span>{user}</span>
              <button 
                onClick={() => removeUser(index)} 
                disabled={isDrawing}
                className="remove-button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 抽奖区域 */}
      <div className="drawing-section">
        <button onClick={draw} disabled={users.length === 0 || isDrawing} className="draw-button">
          {isDrawing ? '抽奖中...' : '开始抽奖'}
        </button>
        <div className="winner-display">
          <h2>获奖者</h2>
          <div className={`winner-name ${winner ? 'winner-announced' : ''}`}>
            {winner ? winner : '尚未抽奖'}
          </div>
        </div>
      </div>

      {/* 历史记录区域 */}
      {history.length > 0 && (
        <div className="history-section">
          <h2>抽奖历史</h2>
          <div className="history-list">
            {history.map((record, index) => (
              <div key={index} className="history-item">
                <span className="history-winner">{record.name}</span>
                <span className="history-time">{record.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
