# Refatoração: Separação de Create e Update Contact Forms

## Visão Geral

A lógica de criação e edição de contatos foi separada em componentes específicos para melhorar a manutenibilidade, clareza e aderência aos princípios de responsabilidade única. Os schemas e tipos seguem o padrão centralizado do módulo.

## Estrutura de Arquivos

### Schemas e Tipos (Centralizados)

**`schemas.ts`** - Schemas Zod do módulo contact
- `contactFormSchema`: schema base (usado para validação de API)
- `createContactFormSchema`: aceita `File | null` para avatar
- `updateContactFormSchema`: aceita `File | string | null` para avatar

**`types.ts`** - Tipos TypeScript do módulo contact
- `ContactFormData`: tipo do schema base
- `CreateContactFormData`: tipo para criação
- `UpdateContactFormData`: tipo para atualização

### Componentes (forms/)

1. **`forms/contact-form-base.tsx`**
   - Componente compartilhado com campos do formulário
   - Usa genéricos para aceitar diferentes tipos de form
   - Adapter para `FileUpload`: converte string URL em `FileMetadata` para preview

2. **`forms/create-contact-form.tsx`**
   - Formulário específico para **criação** de contatos
   - Imports: `createContactFormSchema` de `schemas.ts`, `CreateContactFormData` de `types.ts`
   - Upload de avatar → `uploadToBucket` → URL para action
   - Chama `createContactAction` com `spaceId` hardcoded

3. **`components/update-contact-form.tsx`** (fora da pasta forms)
   - Formulário específico para **atualização** de contatos
   - Imports: `updateContactFormSchema` de `schemas.ts`, `UpdateContactFormData` de `types.ts`
   - Envia apenas campos alterados usando `dirtyFields`
   - Trata avatar: upload novo, manter existente, ou limpar

4. **`forms/index.tsx`**
   - Re-exporta `ContactFormFields` e `CreateContactForm`

### Arquivos de Integração

**`contact-form.tsx`** (components/)
- Re-exporta componentes da pasta forms
- Re-exporta tipos e schemas do módulo raiz (`schemas.ts` e `types.ts`)
- Mantém compatibilidade com imports antigos

**`contact-view.tsx`**
- Renderiza `CreateContactForm` ou `UpdateContactForm` conforme `contactId`

## Decisões Técnicas

### 1. Hardcode de `spaceId`

**Constante:** `DEFAULT_SPACE_ID = 'a069aabe-abdd-4b03-9c11-84437f7d1384'`

- **Localização:** `create-contact-form.tsx`
- **Motivo:** Contexto de espaço ainda não disponível na aplicação
- **TODO:** Migrar para contexto/sessão quando disponível

### 2. Avatar: String vs File

**Problema:** Actions esperam `string | null`, mas upload retorna `File`.

**Solução:**
- Schema de criação: `File | null`
- Schema de atualização: `File | string | null`
- Adapter no `ContactFormFields`: converte URL string em `FileMetadata` para preview
- Upload apenas ocorre quando `avatar instanceof File`

### 3. Envio de Campos Alterados (Update)

**Implementação:**
```typescript
const dirtyFields = form.formState.dirtyFields
const updatePayload: {
  avatar?: string | null
  name?: string
  email?: string
  phone?: string
  notes?: string
} = {}

if (dirtyFields.avatar) { /* tratar upload ou limpeza */ }
if (dirtyFields.name) updatePayload.name = formData.name
// ... outros campos
```

**Benefícios:**
- Evita sobrescrever campos não alterados
- Reduz payload de rede
- Previne race conditions em updates concorrentes
- Alinha com semântica HTTP PATCH

### 4. Preservação do Avatar na Listagem

**Confirmado:** `findContacts` retorna o campo `avatar` (URL string) no tipo `Contact`.

**Fluxo:**
1. Listagem → `Contact` com `avatar: string | null`
2. View → Passa `contact` completo para `UpdateContactForm`
3. Form → Carrega `avatar` como valor inicial
4. Adapter → Converte URL para `FileMetadata` (preview no `FileUpload`)
5. Sem alteração → Omite `avatar` do payload
6. Com alteração → Upload e envia nova URL

## Limitações e Melhorias Futuras

### 1. Naming de Avatar no Upload

**Atual:** Upload usa `user.id` como nome do arquivo.

**Problema:** Para contatos, isso pode causar colisões (todos os contatos do mesmo usuário teriam o mesmo avatar).

**Sugestão:** Usar `contact.id` após criação ou gerar UUID único.

### 2. SpaceId Hardcoded

**Risco de Segurança:** Cliente pode injetar `spaceId` diferente.

**Solução Recomendada:** Derivar `spaceId` server-side na action a partir da sessão/claims do Supabase.

### 3. Validação de Alterações

**Atual:** Confia em `dirtyFields` do react-hook-form.

**Alternativa:** Implementar diff profundo no server para garantir validação de mudanças reais.

## Testes Recomendados

### Cenários de Criação
- [ ] Criar contato sem avatar
- [ ] Criar contato com avatar (validar upload)
- [ ] Validação de campos obrigatórios (nome, email)
- [ ] Email inválido
- [ ] Arquivo muito grande
- [ ] Redirecionamento após sucesso

### Cenários de Atualização
- [ ] Editar apenas nome
- [ ] Editar apenas email
- [ ] Adicionar avatar a contato sem avatar
- [ ] Trocar avatar existente
- [ ] Remover avatar (limpar campo)
- [ ] Não alterar nada → mensagem "Nenhuma alteração detectada"
- [ ] Validação: email inválido, nome muito curto
- [ ] Refresh após atualização

### Cenários de Avatar
- [ ] Preview de avatar existente (URL)
- [ ] Upload de novo avatar
- [ ] Troca de avatar
- [ ] Remoção de avatar
- [ ] Erro de upload → mensagem de erro

## Compatibilidade

### Importações Antigas

Código que importava de `./contact-form` continua funcionando:

```typescript
// Ainda funciona (re-exportado)
import { ContactForm } from './contact-form'

// Novo (recomendado)
import { CreateContactForm, UpdateContactForm } from './contact-form'
```

### Index Exports

`src/modules/contact/components/index.ts` expõe todos os novos componentes via `export * from './contact-form'`.

## Checklist de Migração

- [x] Separar schemas (create vs update)
- [x] Criar `ContactFormFields` compartilhado
- [x] Implementar `CreateContactForm`
- [x] Implementar `UpdateContactForm` com dirty fields
- [x] Adapter para avatar (string → FileMetadata)
- [x] Atualizar `contact-view` para usar componentes separados
- [x] Manter `spaceId` hardcoded (conforme requisito)
- [x] Garantir `avatar` presente em listagem/busca (já existe)
- [x] Validar tipos TypeScript (sem erros)
- [ ] Testar fluxo completo (criar + editar)
- [ ] Documentar para equipe

## Comandos de Teste

```bash
# Verificar tipos
pnpm tsc --noEmit

# Rodar dev server
pnpm dev

# Testar:
# 1. Navegar para /dashboard/contacts/new → CreateContactForm
# 2. Criar contato com/sem avatar
# 3. Navegar para /dashboard/contacts/{id} → UpdateContactForm
# 4. Editar campos, validar payload mínimo
```

---

**Data de Refatoração:** 2025-12-20  
**Autor:** GitHub Copilot  
**Revisão:** Pendente
