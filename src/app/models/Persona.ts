export interface Persona {
    id: number | null; ci: string;
    expedido: number;
    nombre: string;
    ap_paterno: string;
    ap_materno: string;
    celular: string;
    cod_uni_canero: string;
    estado: string//'Activo' | 'Pendiente' | 'Inactivo';
}