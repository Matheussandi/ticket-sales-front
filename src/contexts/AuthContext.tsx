import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

import { tokenStorage } from "../data/di/container";

import type {
	LoginCredentials,
	RegisterCustomerData,
	RegisterData,
	RegisterPartnerData,
	User,
} from "../domain/entities/User";

import type { AuthService } from "../domain/services/AuthService";

interface AuthContextData {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (credentials: LoginCredentials) => Promise<User>;
	register: (data: RegisterData) => Promise<void>;
	registerPartner: (data: RegisterPartnerData) => Promise<void>;
	registerCustomer: (data: RegisterCustomerData) => Promise<void>;
	logout: () => Promise<void>;
	updateUser: (user: User) => void;
}

interface AuthProviderProps {
	children: ReactNode;
	authService: AuthService;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children, authService }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const initAuth = async () => {
			try {
				const storedUser = tokenStorage.getUser<User>();
				const hasToken = tokenStorage.hasToken();

				if (storedUser && hasToken) {
					const isValid = await authService.validateToken();
					if (isValid) {
						setUser(storedUser);
					} else {
						tokenStorage.clear();
					}
				}
			} catch (error) {
				console.error("Erro ao validar sessão:", error);
				tokenStorage.clear();
			} finally {
				setIsLoading(false);
			}
		};

		initAuth();
	}, [authService]);

	const login = async (credentials: LoginCredentials): Promise<User> => {
		setIsLoading(true);
		try {
			const response = await authService.login(credentials);
			setUser(response.user);
			return response.user;
		} finally {
			setIsLoading(false);
		}
	};

	const register = async (data: RegisterData): Promise<void> => {
		setIsLoading(true);
		try {
			const response = await authService.register(data);
			setUser(response.user);
		} finally {
			setIsLoading(false);
		}
	};

	const registerPartner = async (data: RegisterPartnerData): Promise<void> => {
		setIsLoading(true);
		try {
			const response = await authService.registerPartner(data);
			if (response.token) {
				setUser(response.user);
			} else {
				await login({ email: data.email, password: data.password });
			}
		} finally {
			setIsLoading(false);
		}
	};

	const registerCustomer = async (
		data: RegisterCustomerData,
	): Promise<void> => {
		setIsLoading(true);
		try {
			const response = await authService.registerCustomer(data);
			if (response.token) {
				setUser(response.user);
			} else {
				await login({ email: data.email, password: data.password });
			}
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async (): Promise<void> => {
		setIsLoading(true);
		try {
			await authService.logout();
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	const updateUser = (updatedUser: User): void => {
		setUser(updatedUser);
	};

	const value: AuthContextData = {
		user,
		isAuthenticated: !!user,
		isLoading,
		login,
		register,
		registerPartner,
		registerCustomer,
		logout,
		updateUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextData {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth deve ser usado dentro de um AuthProvider");
	}
	return context;
}

export function useRequireAuth() {
	const auth = useAuth();

	useEffect(() => {
		if (!auth.isLoading && !auth.isAuthenticated) {
			window.location.href = "/login";
		}
	}, [auth.isLoading, auth.isAuthenticated]);

	return auth;
}
