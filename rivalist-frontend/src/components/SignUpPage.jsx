import { useState } from 'react'

const SignupPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ name, email, password })
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Terminal-style animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1e1e2f] to-[#0f0f1a] opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,150,0.1)_0%,transparent_70%)] animate-pulse" />
        <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(0,255,128,0.08)_0%,transparent_100%)] animate-spin-slow" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,255,150,0.05)_4px)] opacity-60" />
      </div>

      {/* Signup Form */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-[420px] bg-[#1e1e2f]/80 text-green-400 font-mono text-lg p-6 rounded-xl border border-green-400 shadow-[0_0_25px_#00ff88] backdrop-blur-md"
      >
        <div className="mb-4 text-green-300 text-center text-xl tracking-wider">
          SIGNUP TERMINAL
        </div>

        <pre className="whitespace-pre-wrap leading-7">
{`> New user registration...
> Enter your credentials:

{
  "name": "`}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent text-green-400 border-none outline-none inline"
            style={{ width: `${Math.max(name.length, 1)}ch` }}
            required
          />
{`",
  "email": "`}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent text-green-400 border-none outline-none inline"
            style={{ width: `${Math.max(email.length, 1)}ch` }}
            required
          />
{`",
  "password": "`}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent text-green-400 border-none outline-none inline"
            style={{ width: `${Math.max(password.length, 1)}ch` }}
            required
          />
{`"
}`}
        </pre>

        <button
          type="submit"
          className="mt-6 w-full p-2 bg-green-500 text-black font-bold rounded hover:bg-green-400 transition duration-200"
        >
          ▶ Sign Up
        </button>
      </form>
    </div>
  )
}

export default SignupPage
