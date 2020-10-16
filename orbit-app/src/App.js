import React, { lazy, useContext, Suspense } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import AppShell from './AppShell';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { FetchProvider } from './context/FetchContext';
import FourOFour from './pages/FourOFour';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Account = lazy(() => import('./pages/Account'));
const Settings = lazy(() => import('./pages/Settings'));
const Users = lazy(() => import('./pages/Users'));

function PrivateRoute({ children, ...rest }) {
	const authContext = useContext(AuthContext);

	return (
		<Route
			{...rest}
			render={() => (authContext.isAuthenticated() ? <AppShell>{children}</AppShell> : <Redirect to="/" />)}
		/>
	);
}

function AdminRoute({ children, ...rest }) {
	const authContext = useContext(AuthContext);

	return (
		<Route
			{...rest}
			render={() =>
				authContext.isAuthenticated() && authContext.isAdmin() ? (
					<AppShell>{children}</AppShell>
				) : (
					<Redirect to="/dashboard" />
				)}
		/>
	);
}

const AppRoutes = () => {
	return (
		<Suspense fallback="loading">
		<Switch>
			<Route path="/login">
				<Login />
			</Route>
			<Route path="/signup">
				<Signup />
			</Route>
			<Route exact path="/">
				<Home />
			</Route>
			<PrivateRoute path="/dashboard">
				<Dashboard />
			</PrivateRoute>
			<PrivateRoute path="/inventory">
				<Inventory />
			</PrivateRoute>
			<PrivateRoute path="/account">
				<Account />
			</PrivateRoute>
			<PrivateRoute path="/settings">
				<Settings />
			</PrivateRoute>
			<AdminRoute path="/users">
				<Users />
			</AdminRoute>
			<Route path="*">
				<FourOFour />
			</Route>
			</Switch>
			</Suspense>
	);
};

function App() {
	return (
		<Router>
			<AuthProvider>
				<FetchProvider>
					<div className="bg-gray-100">
						<AppRoutes />
					</div>
				</FetchProvider>
			</AuthProvider>
		</Router>
	);
}

export default App;
