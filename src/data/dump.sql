CREATE TABLE clients (
    id serial primary key,
    cnpj varchar(18) not null unique,
    nome_client text not null  unique,
    senha text not null,
    email text unique,
    location_id integer references location(id) not null,
    gerente_id integer references gerentes(id) not null
);

CREATE TABLE gerentes (
    id serial primary key,
    nome text not null,
    cpf varchar(14) not null,
    email text,
    telefone varchar(11)
);

CREATE TABLE requests (
    id serial primary key,
    produto text not null,
    client_id integer references clients(id) not null,
    status boolean default true,
    create_date timestamp default now(),
    update_date timestamp default now(),
    categoria_id integer references categoria(id),
    quantidade text not null,
    description text,
    marca text
);

CREATE TABLE categorias (
    id serial primary key,
    description text
)

CREATE TABLE location (
    id serial primary key,
    cep varchar(9) not null,
    cidade text not null,
    estado text not null,
    rua text not null,
    numero text not null
);

CREATE TABLE fornecedores (
    id serial primary key,
    cnpj varchar(18) not null,
    email text not null,
    nome_fornecedor text not null unique,
    senha text not null,
    location_id integer references location(id) not null
);

CREATE TABLE ofertas (
    id serial primary key,
    fornecedor_id integer references fornecedores(id) not null,
    request_id integer references requests(id) not null,
    valor integer not null,
    date timestamp default now(),
    status boolean default false
);
