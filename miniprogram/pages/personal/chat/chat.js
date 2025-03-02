// pages/personal/chat/chat.js
Page({
  data: {
    inputValue: '',
    messages: [
      {
        content: '您好，组长，我是香樟树组员XX\n关于观察壹颗树里樟树的问题',
        time: '今天12:20',
        isSender: false
      },
      {
        content: '好的有什么需要我帮你解答吗',
        time: '今天12:21',
        isSender: true
      }
    ]
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  sendMessage() {
    if (!this.data.inputValue.trim()) return
    
    const newMessage = {
      content: this.data.inputValue,
      time: '刚刚',
      isSender: true
    }
    
    this.setData({
      messages: [...this.data.messages, newMessage],
      inputValue: ''
    })
  }
})