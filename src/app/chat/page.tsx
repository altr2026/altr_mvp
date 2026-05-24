import { ChatHome } from '@/components/chat/ChatHome'
import { LifecycleStrip } from '@/components/chat/LifecycleStrip'

export const metadata = {
  title: 'Agent · Narrow down — ALTR',
  description:
    'ALTR agent narrows the right Live IP for your brand. Step 01 of the 6-step lifecycle.',
}

export default function ChatPage() {
  return (
    <>
      <LifecycleStrip currentStep={1} />
      <ChatHome />
    </>
  )
}
