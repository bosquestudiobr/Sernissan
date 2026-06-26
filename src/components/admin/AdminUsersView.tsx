'use client'

import { useActionState, useState } from 'react'

import { AdminFilters } from '@/components/admin/AdminFilters'
import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { MultiSelectField } from '@/components/admin/MultiSelectField'
import { ServerDataTable, type DataTableColumn } from '@/components/data-table/ServerDataTable'
import { TablePagination } from '@/components/data-table/TablePagination'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { PaginatedResult } from '@/lib/types/pagination'
import type { AdminActionState } from '@/server/actions/admin'
import type { UsuarioListRow } from '@/server/queries/admin/usuarios'

type Option = { label: string; value: string }

type AdminUsersViewProps = {
  result: PaginatedResult<UsuarioListRow>
  filterOptions: {
    empresas: Option[]
    setores: Option[]
    grupos: Option[]
    perfis: Option[]
    areas: Option[]
    funcoes: Option[]
    concessionarias: Option[]
  }
  vinculosByUser: Record<string, { grupoIds: string[]; concessionariaIds: string[]; areaIds: string[] }>
  updateAction: (prev: AdminActionState, formData: FormData) => Promise<AdminActionState>
  relationshipsAction: (prev: AdminActionState, formData: FormData) => Promise<AdminActionState>
  toggleActiveAction: (prev: AdminActionState, formData: FormData) => Promise<AdminActionState>
  approveAction: (prev: AdminActionState, formData: FormData) => Promise<AdminActionState>
}

const initialState: AdminActionState = { ok: false }

export function AdminUsersView({
  result,
  filterOptions,
  vinculosByUser,
  updateAction,
  relationshipsAction,
  toggleActiveAction,
  approveAction,
}: AdminUsersViewProps) {
  const [editing, setEditing] = useState<UsuarioListRow | null>(null)
  const [vinculosUser, setVinculosUser] = useState<UsuarioListRow | null>(null)
  const [updateState, updateFormAction, updatePending] = useActionState(updateAction, initialState)
  const [relState, relFormAction, relPending] = useActionState(relationshipsAction, initialState)
  const [, toggleFormAction] = useActionState(toggleActiveAction, initialState)
  const [, approveFormAction] = useActionState(approveAction, initialState)

  async function handleToggle(row: UsuarioListRow, field: 'ativo' | 'aprovado', value: boolean) {
    const fd = new FormData()
    fd.set('id', row.id)
    if (field === 'ativo') {
      fd.set('ativo', String(value))
      await toggleFormAction(fd)
    } else {
      fd.set('aprovado', String(value))
      await approveFormAction(fd)
    }
  }

  const columns: DataTableColumn<UsuarioListRow>[] = [
    { key: 'nome', header: 'Nome', cell: (row) => row.nome ?? '—' },
    { key: 'email', header: 'E-mail', cell: (row) => row.email ?? '—' },
    { key: 'perfil', header: 'Perfil', cell: (row) => row.perfilLabel ?? '—' },
    {
      key: 'ativo',
      header: 'Ativo',
      cell: (row) => (
        <Switch checked={row.ativo === true} onCheckedChange={(value) => handleToggle(row, 'ativo', value)} />
      ),
    },
    {
      key: 'aprovado',
      header: 'Aprovado',
      cell: (row) => (
        <Switch checked={row.aprovado === true} onCheckedChange={(value) => handleToggle(row, 'aprovado', value)} />
      ),
    },
    {
      key: 'actions',
      header: 'Acoes',
      cell: (row) => (
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="outline" className="h-8" onClick={() => setEditing(row)}>
            Editar
          </Button>
          <Button type="button" size="sm" variant="outline" className="h-8" onClick={() => setVinculosUser(row)}>
            Vinculos
          </Button>
        </div>
      ),
    },
  ]

  const vinculos = vinculosUser ? vinculosByUser[vinculosUser.id] : null

  return (
    <AdminPageShell
      title="Usuarios"
      description="Gestao de profiles e vinculos organizacionais."
      filters={
        <AdminFilters
          filters={[
            { key: 'perfil', label: 'Perfil', options: filterOptions.perfis },
            { key: 'ativo', label: 'Ativo', options: [{ label: 'Sim', value: 'true' }, { label: 'Nao', value: 'false' }] },
            { key: 'aprovado', label: 'Aprovado', options: [{ label: 'Sim', value: 'true' }, { label: 'Nao', value: 'false' }] },
            { key: 'grupo', label: 'Grupo', options: filterOptions.grupos },
            { key: 'concessionaria', label: 'Concessionaria', options: filterOptions.concessionarias },
            { key: 'area', label: 'Area', options: filterOptions.areas },
            { key: 'funcao', label: 'Funcao', options: filterOptions.funcoes },
          ]}
        />
      }
      footer={
        <TablePagination
          page={result.page}
          pageCount={result.pageCount}
          total={result.total}
          className="border-t border-[var(--sn-border)] pt-4"
        />
      }
    >
      <ServerDataTable
        columns={columns}
        data={result.data}
        emptyTitle="Nenhum usuario encontrado"
        emptyDescription="Ajuste os filtros ou aguarde novos cadastros."
      />

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
          </DialogHeader>
          {editing ? (
            <form action={updateFormAction} className="space-y-3">
              <input type="hidden" name="id" value={editing.id} />
              <div className="space-y-1">
                <Label>E-mail</Label>
                <Input value={editing.email ?? ''} disabled className="bg-[var(--sn-field)]" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" name="nome" defaultValue={editing.nome ?? ''} required className="bg-[var(--sn-field)]" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="perfil">Perfil</Label>
                <select
                  id="perfil"
                  name="perfil"
                  defaultValue={editing.perfil ?? ''}
                  className="h-9 w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm"
                >
                  {filterOptions.perfis.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {[
                { name: 'empresa', label: 'Empresa', options: filterOptions.empresas },
                { name: 'setor', label: 'Setor', options: filterOptions.setores },
                { name: 'grupo', label: 'Grupo', options: filterOptions.grupos },
                { name: 'concessionaria', label: 'Concessionaria', options: filterOptions.concessionarias },
                { name: 'area', label: 'Area padrao', options: filterOptions.areas },
                { name: 'funcao', label: 'Funcao padrao', options: filterOptions.funcoes },
              ].map((field) => (
                <div key={field.name} className="space-y-1">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <select
                    id={field.name}
                    name={field.name}
                    defaultValue={editing[field.name as keyof UsuarioListRow] as string | null ?? ''}
                    className="h-9 w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm"
                  >
                    <option value="">Selecione...</option>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              {updateState.message && !updateState.ok ? (
                <p className="text-sm text-[var(--sn-red)]">{updateState.message}</p>
              ) : null}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={updatePending} className="bg-[var(--sn-black)] text-white hover:bg-black/90">
                  {updatePending ? 'Salvando...' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={vinculosUser !== null} onOpenChange={(open) => !open && setVinculosUser(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vinculos do usuario</DialogTitle>
          </DialogHeader>
          {vinculosUser && vinculos ? (
            <form action={relFormAction} className="space-y-3">
              <input type="hidden" name="id" value={vinculosUser.id} />
              <MultiSelectField
                name="grupoIds"
                label="Grupos disponiveis"
                options={filterOptions.grupos}
                defaultSelected={vinculos.grupoIds}
              />
              <MultiSelectField
                name="concessionariaIds"
                label="Concessionarias da equipe"
                options={filterOptions.concessionarias}
                defaultSelected={vinculos.concessionariaIds}
              />
              <MultiSelectField
                name="areaIds"
                label="Areas disponiveis"
                options={filterOptions.areas}
                defaultSelected={vinculos.areaIds}
              />
              <div className="space-y-1">
                <Label htmlFor="funcaoId">Funcao padrao</Label>
                <select
                  id="funcaoId"
                  name="funcaoId"
                  defaultValue={vinculosUser.funcao ?? ''}
                  className="h-9 w-full rounded-md border border-[var(--sn-border)] bg-[var(--sn-field)] px-2 text-sm"
                >
                  <option value="">Nenhuma</option>
                  {filterOptions.funcoes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {relState.message && !relState.ok ? (
                <p className="text-sm text-[var(--sn-red)]">{relState.message}</p>
              ) : null}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setVinculosUser(null)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={relPending} className="bg-[var(--sn-black)] text-white hover:bg-black/90">
                  {relPending ? 'Salvando...' : 'Salvar vinculos'}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  )
}

