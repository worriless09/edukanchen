
# Kanchen Academy - Phase 1 Setup Instructions

## Prerequisites
- Node.js 18+ installed
- Supabase account and project setup
- Git repository cloned

## Step 1: Install Dependencies

```bash
npm install @radix-ui/react-avatar @radix-ui/react-dropdown-menu
npm install lucide-react
npm install @supabase/supabase-js
npm install openai (for future AI features)
```

## Step 2: Create/Update Files

Copy all the provided code files to their respective locations:

### 1. Update app/layout.tsx
Replace your current app/layout.tsx with the provided code.

### 2. Create Authentication Pages
Create these directories and files:
- app/(auth)/layout.tsx
- app/(auth)/login/page.tsx  
- app/(auth)/register/page.tsx

### 3. Update Components
- components/UnifiedKanchenAcademy.tsx (replace)
- components/ErrorBoundary.tsx (replace)
- components/layout/header-optimized.tsx (replace)
- components/layout/Navigation.tsx (replace)

### 4. Create Missing UI Components
- components/ui/LoadingSpinner.tsx (new)
- components/ui/avatar.tsx (if not exists)
- components/ui/dropdown-menu.tsx (if not exists)

### 5. Create Additional Pages
- app/settings/page.tsx (new)
- Update app/page.tsx

## Step 3: Environment Setup

Create .env.local file with your configuration:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 4: Test the Setup

```bash
npm run dev
```

## Step 5: Verify Authentication Flow

1. Visit http://localhost:3000
2. Click "Get Started" or navigate to /register
3. Try creating an account
4. Test login at /login
5. Check protected routes work (should redirect to auth if not logged in)

## Features Implemented

✅ Authentication system integration
✅ Protected route handling  
✅ Responsive navigation with user profile
✅ Error boundary for graceful error handling
✅ Mobile-responsive design
✅ User profile dropdown
✅ Progress indicators in sidebar
✅ Clean auth pages with branding

## Next Steps (Week 3-4)

After this setup is working:
1. Integrate CourseList and CourseDashboard components
2. Set up Flashcard system
3. Implement Mock Test interface
4. Add video upload functionality

## Troubleshooting

**Issue: AuthProvider errors**
- Ensure Supabase client is properly configured
- Check environment variables are loaded

**Issue: Navigation not showing user data**  
- Verify user object is passed correctly from AuthProvider
- Check Supabase auth state management

**Issue: Protected routes not working**
- Ensure useAuth hook is working
- Check pathname detection logic

**Issue: Styling issues**
- Ensure Tailwind CSS is configured properly
- Check all required UI components exist
