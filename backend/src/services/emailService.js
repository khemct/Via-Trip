const emailService = {
  sendPasswordReset: (email, token) => {
    const resetLink = `http://localhost:3000/reset-password?token=${token}`
    
    // For Progress I: Log to console instead of sending real email
    console.log('='.repeat(50))
    console.log('PASSWORD RESET LINK (Progress I - Demo Mode)')
    console.log(`To: ${email}`)
    console.log(`Link: ${resetLink}`)
    console.log('='.repeat(50))
    
    return true
  }
}

module.exports = emailService
