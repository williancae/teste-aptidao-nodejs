import { cnpj, cpf } from 'cpf-cnpj-validator';

export function validateCpfCnpj(document: string): boolean {
  const cleanDocument = document.replace(/\D/g, '');

  if (cleanDocument.length === 11) {
    return cpf.isValid(cleanDocument);
  } else if (cleanDocument.length === 14) {
    return cnpj.isValid(cleanDocument);
  }

  return false;
}

export function formatCpfCnpj(document: string): string {
  const cleanDocument = document.replace(/\D/g, '');

  if (cleanDocument.length === 11) {
    return cpf.format(cleanDocument);
  } else if (cleanDocument.length === 14) {
    return cnpj.format(cleanDocument);
  }

  return document;
}
