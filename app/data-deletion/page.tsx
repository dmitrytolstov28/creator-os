export default function DataDeletionPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 rounded-2xl border border-emerald-500/20 bg-zinc-950/80 p-8 shadow-2xl shadow-emerald-950/20 backdrop-blur">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">
            CreatorOS
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-white">
            Data Deletion Instructions
          </h1>

          <p className="mt-4 text-sm text-zinc-400">
            Last Updated: September 7, 2026
          </p>
        </div>

        <div className="space-y-10 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-8 leading-7 text-zinc-300 shadow-xl">
          <section>
            <p>
              CreatorOS allows users to request deletion of their CreatorOS
              account and associated personal information, including information
              obtained through connected Instagram or Meta accounts.
            </p>

            <p className="mt-4">
              You may request deletion at any time by following the instructions
              below.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              1. What Data Can Be Deleted
            </h2>

            <p>A deletion request may include:</p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Your CreatorOS account information</li>
              <li>Your email address and account profile information</li>
              <li>User preferences and interface settings</li>
              <li>Connected Instagram account information</li>
              <li>Instagram media information stored by CreatorOS</li>
              <li>Post captions and content metadata</li>
              <li>Analytics and performance information</li>
              <li>Instagram insights obtained through Meta APIs</li>
              <li>Stored Instagram or Meta connection information</li>
              <li>AI-related account analysis associated with your account</li>
              <li>Other CreatorOS data associated with your user account</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              2. How to Request Data Deletion
            </h2>

            <p>
              To request deletion of your CreatorOS data, send an email to:
            </p>

            <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <p className="font-semibold text-white">
                CreatorOS Data Deletion
              </p>

              <p className="mt-1 text-emerald-400">
                dmitry.tolstov28@gmail.com
              </p>
            </div>

            <p className="mt-6">
              Your request should include:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Your CreatorOS account email address</li>
              <li>Your Instagram username, if your Instagram account is connected</li>
              <li>
                A statement that you are requesting deletion of your CreatorOS
                account and/or connected Instagram data
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              3. Identity Verification
            </h2>

            <p>
              To protect user accounts from unauthorized deletion requests,
              CreatorOS may require reasonable verification that the person
              submitting the request owns the affected CreatorOS account.
            </p>

            <p className="mt-4">
              CreatorOS will not ask you to send your password, Meta password,
              Instagram password, private access token, or other sensitive login
              credentials.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              4. Instagram and Meta Data
            </h2>

            <p>
              If your CreatorOS account is connected to Instagram through
              Meta&apos;s services, you may request deletion of data previously
              obtained through that connection.
            </p>

            <p className="mt-4">
              This may include Instagram account information, media metadata,
              engagement information, analytics, insights, and other information
              stored by CreatorOS as part of your connected account.
            </p>

            <p className="mt-4">
              Disconnecting your Instagram account may prevent CreatorOS from
              obtaining new data, but it does not necessarily remove all
              previously stored information. Submit a deletion request if you
              want previously stored data removed.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              5. Data We May Need to Retain
            </h2>

            <p>
              In limited circumstances, some information may be retained when
              reasonably necessary for legal, security, fraud-prevention,
              dispute-resolution, or regulatory purposes.
            </p>

            <p className="mt-4">
              Any information retained for these purposes will not be used for
              normal CreatorOS product functionality.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              6. Processing Time
            </h2>

            <p>
              CreatorOS will process valid deletion requests within a reasonable
              period of time after the request has been verified.
            </p>

            <p className="mt-4">
              Processing time may vary depending on the amount and type of data
              associated with the account.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              7. Disconnecting CreatorOS From Meta
            </h2>

            <p>
              You may also remove CreatorOS from your Facebook or Instagram
              account through the applicable Meta account settings.
            </p>

            <p className="mt-4">
              Removing authorization may prevent CreatorOS from accessing new
              Meta or Instagram information associated with your account.
            </p>

            <p className="mt-4">
              If you also want previously stored CreatorOS data deleted, submit
              a deletion request using the instructions on this page.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              8. Contact
            </h2>

            <p>
              For questions about your data or a deletion request, contact:
            </p>

            <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <p className="font-semibold text-white">CreatorOS</p>

              <p className="mt-1 text-emerald-400">
                dmitry.tolstov28@gmail.com
              </p>
            </div>
          </section>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-600">
          © 2026 CreatorOS. All rights reserved.
        </p>
      </div>
    </main>
  );
}