interface AppCaroucelProps {
carLink: string;
carLinkImagem: string;
carTipo: string;
carTitulo: string;
}

interface AssignDocsProps {
    date: string;
    number: string;
    origin: string;
    serie: string;
    link: string;
    cliente?: string;
    client?: string;
    customer?: string;
    nomeCliente?: string;
    serviceType?: string;
    tipoServico?: string;
    tipo_servico?: string;
    tipoDeServico?: string;
}

export type {AppCaroucelProps, AssignDocsProps}
