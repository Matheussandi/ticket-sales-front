import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { tokenStorage } from "../data/di/container";
import type { LoginCredentials, RegisterData, User } from "../domain/entities/User";
import type { AuthService } from "../domain/services/AuthService";

/**
 * Auth Context State
 */
interface AuthContextData {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (credentials: LoginCredentials) => Promise<void>;
	register: (data: RegisterData) => Promise<void>;
	logout: () => Promise<void>;
}

/**
 * Auth Provider Props
 */
interface AuthProviderProps {
	children: ReactNode;
	authService: AuthService;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

/**
 * Auth Provider Component
 *
 * Gerencia estado global de autenticação usando Context API.
 * Recebe AuthService via injeção de dependência.
 */
export function AuthProvider({ children, authService }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	/**
	 * Inicialização: verifica se existe sessão ativa
	 */
	useEffect(() => {
		const initAuth = async () => {
			try {
				const storedUser = tokenStorage.getUser<User>();
				const hasToken = tokenStorage.hasToken();

				if (storedUser && hasToken) {
					// Valida token no servidor
					const isValid = await authService.validateToken();
					if (isValid) {
						setUser(storedUser);
					} else {
						// Token inválido, limpa dados
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

	/**
	 * Realiza login
	 */
	const login = async (credentials: LoginCredentials): Promise<void> => {
		setIsLoading(true);
		try {
			const response = await authService.login(credentials);
			setUser(response.user);
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Registra novo usuário
	 */
	const register = async (data: RegisterData): Promise<void> => {
		setIsLoading(true);
		try {
			const response = await authService.register(data);
			setUser(response.user);
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Faz logout
	 */
	const logout = async (): Promise<void> => {
		setIsLoading(true);
		try {
			await authService.logout();
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	const value: AuthContextData = {
		user,
		isAuthenticated: !!user,
		isLoading,
		login,
		register,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook
 *
 * Hook para acessar contexto de autenticação.
 * @throws {Error} Se usado fora do AuthProvider
 */
export function useAuth(): AuthContextData {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth deve ser usado dentro de um AuthProvider");
	}
	return context;
}

/**
 * useRequireAuth Hook
 *
 * Hook para componentes que exigem autenticação.
 * Redireciona para login se não autenticado.
 */
export function useRequireAuth() {
	const auth = useAuth();

	useEffect(() => {
		if (!auth.isLoading && !auth.isAuthenticated) {
			// Redirecionar para login
			window.location.href = "/login";
		}
	}, [auth.isLoading, auth.isAuthenticated]);

	return auth;
}
