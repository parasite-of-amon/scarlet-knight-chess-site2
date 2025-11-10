import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import PastEvents from "./pages/PastEvents";
import UpcomingEvents from "./pages/UpcomingEvents";
import PastEventsNew from "./pages/events/PastEventsNew";
import UpcomingEventsNew from "./pages/events/UpcomingEventsNew";
import Calendar from "./pages/Calendar";
import Membership from "./pages/Membership";
import Resources from "./pages/Resources";
import Sponsors from "./pages/Sponsors";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/events/past-new" component={PastEventsNew} />
            <Route path="/events/upcoming-new" component={UpcomingEventsNew} />
            <Route path="/events/past" component={PastEvents} />
            <Route path="/events/upcoming" component={UpcomingEvents} />
            <Route path="/events/calendar" component={Calendar} />
            <Route path="/events" component={Events} />
            <Route path="/membership" component={Membership} />
            <Route path="/resources" component={Resources} />
            <Route path="/sponsors" component={Sponsors} />
            <Route path="/contact" component={Contact} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
