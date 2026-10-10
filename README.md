Fair Pay Trail, built by Eshaan (BeanQueso) and Matt (oumatthew11), is a mobile-first web app that helps workers organize evidence of possible wage theft into a clear case. The project was designed to advance UN Sustainable Development Goal 8: Decent Work and Economic Growth, particularly its focus on protecting labor rights and promoting fair working conditions. It uses Supabase for authentication, PostgreSQL database storage, private file storage, Row Level Security, and Edge Functions, and AI-powered document extraction and case analysis through the Lovable gateway. Core features include secure evidence uploads, extracted facts, case timelines, possible pay-discrepancy detection, missing-evidence guidance, recommended next steps, and case-packet support. The frontend is built in Lovable and connected to Supabase through @supabase/supabase-js.


## Local setup

Copy `.env.example` to `.env`, then supply your Supabase project URL and publishable browser key. Run `npm install` and `npm run dev`. Local `.env` files are ignored by Git.

The current Edge Functions call the Lovable AI gateway. Configure `LOVABLE_API_KEY` and the Supabase server credentials in the hosted function environment, never in a `VITE_` variable or source file. Browser configuration is public by design; database and file access must remain protected by the supplied Row Level Security policies.
