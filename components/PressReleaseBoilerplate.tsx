export default function PressReleaseBoilerplate() {
  return (
    <div className="mt-12 pt-8 border-t border-gray-200 pr-boilerplate">
      <h4 className="font-bold text-lg text-gray-900 mb-2 pr-boilerplate-heading">
        About Automation Anywhere
      </h4>
      <p className="mb-6 text-gray-700 pr-boilerplate-text">
        Automation Anywhere has been committed to defining the future of work by unleashing
        human potential through automation for over 20 years. The company enables this future
        through its leading Agentic Process Automation (APA) System for IT leaders and
        developers as well as purpose-built agentic solutions for business leaders in finance,
        customer service, IT and HR. Learn more at{' '}
        <a href="/" className="text-orange-500 underline">
          www.automationanywhere.com
        </a>
      </p>

      <h4 className="font-bold text-lg text-gray-900 mb-2 pr-boilerplate-heading">
        Connect with Automation Anywhere
      </h4>
      <p className="mb-6 pr-boilerplate-text">
        Follow us:{' '}
        <a href="#" className="text-orange-500 underline">LinkedIn</a>
        {' | '}
        <a href="#" className="text-orange-500 underline">Instagram</a>
        {' | '}
        <a href="#" className="text-orange-500 underline">Youtube</a>
        <br />
        More content:{' '}
        <a href="/company/blog" className="text-orange-500 underline">Blog</a>
        {' | '}
        <a href="#" className="text-orange-500 underline">Community</a>
        {' | '}
        <a href="#" className="text-orange-500 underline">Newsletter</a>
        {' | '}
        <a href="#" className="text-orange-500 underline">Webinars</a>
        <br />
        Ready to see Agentic Process Automation (APA) in action?{' '}
        <a href="#" className="text-orange-500 underline">Request a demo</a>
      </p>

      <p className="text-sm pr-boilerplate-legal">
        Automation Anywhere is a registered trademark/service mark of Automation Anywhere, Inc.
        in the United States and other countries. Other marks referenced are the property of
        their respective owners.
      </p>
    </div>
  )
}