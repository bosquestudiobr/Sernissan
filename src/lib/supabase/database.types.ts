export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      agendamentos: {
        Row: {
          bubble_id: string | null
          concessionaria: string | null
          created_at: string
          created_by: string | null
          data_fim: string | null
          data_inicio: string | null
          data_range: Json | null
          dia_todo: boolean | null
          empresa: string | null
          gerente: string | null
          id: string
          placar: string | null
          titulo: string | null
          updated_at: string
          user: string | null
        }
        Insert: {
          bubble_id?: string | null
          concessionaria?: string | null
          created_at?: string
          created_by?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          data_range?: Json | null
          dia_todo?: boolean | null
          empresa?: string | null
          gerente?: string | null
          id?: string
          placar?: string | null
          titulo?: string | null
          updated_at?: string
          user?: string | null
        }
        Update: {
          bubble_id?: string | null
          concessionaria?: string | null
          created_at?: string
          created_by?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          data_range?: Json | null
          dia_todo?: boolean | null
          empresa?: string | null
          gerente?: string | null
          id?: string
          placar?: string | null
          titulo?: string | null
          updated_at?: string
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_agendamentos_concessionaria_concessionaria_id"
            columns: ["concessionaria"]
            isOneToOne: false
            referencedRelation: "concessionaria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_agendamentos_empresa_empresa_id"
            columns: ["empresa"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_agendamentos_placar_placar_id"
            columns: ["placar"]
            isOneToOne: false
            referencedRelation: "placar"
            referencedColumns: ["id"]
          },
        ]
      }
      agendamentos_convidados: {
        Row: {
          agendamentos_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          agendamentos_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          agendamentos_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_agendamentos_convidados_agendamentos_id_agendamentos_id"
            columns: ["agendamentos_id"]
            isOneToOne: false
            referencedRelation: "agendamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      agendamentos_users: {
        Row: {
          agendamentos_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          agendamentos_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          agendamentos_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_agendamentos_users_agendamentos_id_agendamentos_id"
            columns: ["agendamentos_id"]
            isOneToOne: false
            referencedRelation: "agendamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      app_options: {
        Row: {
          db_value: string | null
          is_deleted: boolean
          key: string
          label: string
          metadata: Json
          option_set: string
          sort_order: number | null
        }
        Insert: {
          db_value?: string | null
          is_deleted?: boolean
          key: string
          label: string
          metadata?: Json
          option_set: string
          sort_order?: number | null
        }
        Update: {
          db_value?: string | null
          is_deleted?: boolean
          key?: string
          label?: string
          metadata?: Json
          option_set?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      calibracao_resultado: {
        Row: {
          acao: string | null
          acao_data: string | null
          acao_status: string | null
          bubble_id: string | null
          calibracao: string | null
          competencia: string | null
          created_at: string
          created_by: string | null
          habito: string | null
          id: string
          opcao_colaborador: string | null
          opcao_follow_up: string | null
          opcao_lider: string | null
          pontos_autocalibracao: number | null
          pontos_follow_up: number | null
          pontos_lider: number | null
          tipo: string | null
          updated_at: string
        }
        Insert: {
          acao?: string | null
          acao_data?: string | null
          acao_status?: string | null
          bubble_id?: string | null
          calibracao?: string | null
          competencia?: string | null
          created_at?: string
          created_by?: string | null
          habito?: string | null
          id?: string
          opcao_colaborador?: string | null
          opcao_follow_up?: string | null
          opcao_lider?: string | null
          pontos_autocalibracao?: number | null
          pontos_follow_up?: number | null
          pontos_lider?: number | null
          tipo?: string | null
          updated_at?: string
        }
        Update: {
          acao?: string | null
          acao_data?: string | null
          acao_status?: string | null
          bubble_id?: string | null
          calibracao?: string | null
          competencia?: string | null
          created_at?: string
          created_by?: string | null
          habito?: string | null
          id?: string
          opcao_colaborador?: string | null
          opcao_follow_up?: string | null
          opcao_lider?: string | null
          pontos_autocalibracao?: number | null
          pontos_follow_up?: number | null
          pontos_lider?: number | null
          tipo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_calibracao_resultado_calibracao_competencia_calibracao_id"
            columns: ["calibracao"]
            isOneToOne: false
            referencedRelation: "competencia_calibracao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_calibracao_resultado_habito_competencia_habito_id"
            columns: ["habito"]
            isOneToOne: false
            referencedRelation: "competencia_habito"
            referencedColumns: ["id"]
          },
        ]
      }
      competencia_calibracao: {
        Row: {
          autocalibracao: string[]
          bubble_id: string | null
          colaborador: string | null
          concessionaria: string | null
          created_at: string
          created_by: string | null
          data_autocalibracao: string | null
          data_calibracao: string | null
          data_finalizada: string | null
          data_follow_up: string | null
          data_lider: string | null
          finalizada: boolean
          followup: string[]
          id: string
          lider: string[]
          updated_at: string
        }
        Insert: {
          autocalibracao?: string[]
          bubble_id?: string | null
          colaborador?: string | null
          concessionaria?: string | null
          created_at?: string
          created_by?: string | null
          data_autocalibracao?: string | null
          data_calibracao?: string | null
          data_finalizada?: string | null
          data_follow_up?: string | null
          data_lider?: string | null
          finalizada?: boolean
          followup?: string[]
          id?: string
          lider?: string[]
          updated_at?: string
        }
        Update: {
          autocalibracao?: string[]
          bubble_id?: string | null
          colaborador?: string | null
          concessionaria?: string | null
          created_at?: string
          created_by?: string | null
          data_autocalibracao?: string | null
          data_calibracao?: string | null
          data_finalizada?: string | null
          data_follow_up?: string | null
          data_lider?: string | null
          finalizada?: boolean
          followup?: string[]
          id?: string
          lider?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_competencia_calibracao_concessionaria_concessionaria_id"
            columns: ["concessionaria"]
            isOneToOne: false
            referencedRelation: "concessionaria"
            referencedColumns: ["id"]
          },
        ]
      }
      competencia_calibracao_areas: {
        Row: {
          competencia_calibracao_id: string
          created_at: string
          setor_concessionaria_id: string
        }
        Insert: {
          competencia_calibracao_id: string
          created_at?: string
          setor_concessionaria_id: string
        }
        Update: {
          competencia_calibracao_id?: string
          created_at?: string
          setor_concessionaria_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_competencia_calibracao_areas_competencia_calibracao_id_co"
            columns: ["competencia_calibracao_id"]
            isOneToOne: false
            referencedRelation: "competencia_calibracao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_competencia_calibracao_areas_setor_concessionaria_id_seto"
            columns: ["setor_concessionaria_id"]
            isOneToOne: false
            referencedRelation: "setor_concessionaria"
            referencedColumns: ["id"]
          },
        ]
      }
      competencia_calibracao_funcoes: {
        Row: {
          competencia_calibracao_id: string
          created_at: string
          funcao_colaborador_id: string
        }
        Insert: {
          competencia_calibracao_id: string
          created_at?: string
          funcao_colaborador_id: string
        }
        Update: {
          competencia_calibracao_id?: string
          created_at?: string
          funcao_colaborador_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_competencia_calibracao_funcoes_competencia_calibracao_id_"
            columns: ["competencia_calibracao_id"]
            isOneToOne: false
            referencedRelation: "competencia_calibracao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_competencia_calibracao_funcoes_funcao_colaborador_id_func"
            columns: ["funcao_colaborador_id"]
            isOneToOne: false
            referencedRelation: "funcao_colaborador"
            referencedColumns: ["id"]
          },
        ]
      }
      competencia_calibracao_mapas: {
        Row: {
          competencia_calibracao_id: string
          competencia_mapa_id: string
          created_at: string
        }
        Insert: {
          competencia_calibracao_id: string
          competencia_mapa_id: string
          created_at?: string
        }
        Update: {
          competencia_calibracao_id?: string
          competencia_mapa_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_competencia_calibracao_mapas_competencia_calibracao_id_co"
            columns: ["competencia_calibracao_id"]
            isOneToOne: false
            referencedRelation: "competencia_calibracao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_competencia_calibracao_mapas_competencia_mapa_id_competen"
            columns: ["competencia_mapa_id"]
            isOneToOne: false
            referencedRelation: "competencia_mapa"
            referencedColumns: ["id"]
          },
        ]
      }
      competencia_calibracao_resultados: {
        Row: {
          calibracao_resultado_id: string
          competencia_calibracao_id: string
          created_at: string
        }
        Insert: {
          calibracao_resultado_id: string
          competencia_calibracao_id: string
          created_at?: string
        }
        Update: {
          calibracao_resultado_id?: string
          competencia_calibracao_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_competencia_calibracao_resultados_calibracao_resultado_id"
            columns: ["calibracao_resultado_id"]
            isOneToOne: false
            referencedRelation: "calibracao_resultado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_competencia_calibracao_resultados_competencia_calibracao_"
            columns: ["competencia_calibracao_id"]
            isOneToOne: false
            referencedRelation: "competencia_calibracao"
            referencedColumns: ["id"]
          },
        ]
      }
      competencia_habito: {
        Row: {
          area: string | null
          bubble_id: string | null
          created_at: string
          created_by: string | null
          descricao: string | null
          essencial: boolean | null
          id: string
          id_2: string | null
          momento_de_verdade: string | null
          mv: string | null
          pergunta: string | null
          peso: number | null
          trilha: number | null
          updated_at: string
        }
        Insert: {
          area?: string | null
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          essencial?: boolean | null
          id?: string
          id_2?: string | null
          momento_de_verdade?: string | null
          mv?: string | null
          pergunta?: string | null
          peso?: number | null
          trilha?: number | null
          updated_at?: string
        }
        Update: {
          area?: string | null
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          essencial?: boolean | null
          id?: string
          id_2?: string | null
          momento_de_verdade?: string | null
          mv?: string | null
          pergunta?: string | null
          peso?: number | null
          trilha?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      competencia_indicador: {
        Row: {
          bubble_id: string | null
          created_at: string
          created_by: string | null
          id: string
          updated_at: string
        }
        Insert: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      competencia_mapa: {
        Row: {
          atitudes: string[]
          bubble_id: string | null
          competencias_especificas: string[]
          competencias_sernissan: string[]
          conhecimentos: string[]
          created_at: string
          created_by: string | null
          data: string | null
          entrega: string | null
          ferramentas: string[]
          funcao_mapa: string | null
          habilidades: string[]
          id: string
          para_que: string | null
          treinamentos_e_learning: string[]
          treinamentos_presenciais: string[]
          updated_at: string
          versao: string | null
        }
        Insert: {
          atitudes?: string[]
          bubble_id?: string | null
          competencias_especificas?: string[]
          competencias_sernissan?: string[]
          conhecimentos?: string[]
          created_at?: string
          created_by?: string | null
          data?: string | null
          entrega?: string | null
          ferramentas?: string[]
          funcao_mapa?: string | null
          habilidades?: string[]
          id?: string
          para_que?: string | null
          treinamentos_e_learning?: string[]
          treinamentos_presenciais?: string[]
          updated_at?: string
          versao?: string | null
        }
        Update: {
          atitudes?: string[]
          bubble_id?: string | null
          competencias_especificas?: string[]
          competencias_sernissan?: string[]
          conhecimentos?: string[]
          created_at?: string
          created_by?: string | null
          data?: string | null
          entrega?: string | null
          ferramentas?: string[]
          funcao_mapa?: string | null
          habilidades?: string[]
          id?: string
          para_que?: string | null
          treinamentos_e_learning?: string[]
          treinamentos_presenciais?: string[]
          updated_at?: string
          versao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_competencia_mapa_funcao_mapa_funcao_colaborador_id"
            columns: ["funcao_mapa"]
            isOneToOne: false
            referencedRelation: "funcao_colaborador"
            referencedColumns: ["id"]
          },
        ]
      }
      competencia_mapa_habitos: {
        Row: {
          competencia_habito_id: string
          competencia_mapa_id: string
          created_at: string
        }
        Insert: {
          competencia_habito_id: string
          competencia_mapa_id: string
          created_at?: string
        }
        Update: {
          competencia_habito_id?: string
          competencia_mapa_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_competencia_mapa_habitos_competencia_habito_id_competenci"
            columns: ["competencia_habito_id"]
            isOneToOne: false
            referencedRelation: "competencia_habito"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_competencia_mapa_habitos_competencia_mapa_id_competencia_"
            columns: ["competencia_mapa_id"]
            isOneToOne: false
            referencedRelation: "competencia_mapa"
            referencedColumns: ["id"]
          },
        ]
      }
      competencia_mapa1: {
        Row: {
          atitudes: string[]
          bubble_id: string | null
          competencias_especificas: string[]
          competencias_sernissan: string[]
          conhecimentos: string[]
          created_at: string
          created_by: string | null
          data: string | null
          entrega: string | null
          ferramentas: string[]
          funcao_mapa: string | null
          habilidades: string[]
          id: string
          para_que: string | null
          treinamentos_e_learning: string[]
          treinamentos_presenciais: string[]
          updated_at: string
          versao: string | null
        }
        Insert: {
          atitudes?: string[]
          bubble_id?: string | null
          competencias_especificas?: string[]
          competencias_sernissan?: string[]
          conhecimentos?: string[]
          created_at?: string
          created_by?: string | null
          data?: string | null
          entrega?: string | null
          ferramentas?: string[]
          funcao_mapa?: string | null
          habilidades?: string[]
          id?: string
          para_que?: string | null
          treinamentos_e_learning?: string[]
          treinamentos_presenciais?: string[]
          updated_at?: string
          versao?: string | null
        }
        Update: {
          atitudes?: string[]
          bubble_id?: string | null
          competencias_especificas?: string[]
          competencias_sernissan?: string[]
          conhecimentos?: string[]
          created_at?: string
          created_by?: string | null
          data?: string | null
          entrega?: string | null
          ferramentas?: string[]
          funcao_mapa?: string | null
          habilidades?: string[]
          id?: string
          para_que?: string | null
          treinamentos_e_learning?: string[]
          treinamentos_presenciais?: string[]
          updated_at?: string
          versao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_competencia_mapa1_funcao_mapa_funcao_colaborador_id"
            columns: ["funcao_mapa"]
            isOneToOne: false
            referencedRelation: "funcao_colaborador"
            referencedColumns: ["id"]
          },
        ]
      }
      competencia_mapa2: {
        Row: {
          atitudes: string[]
          bubble_id: string | null
          competencias_especificas: string[]
          competencias_sernissan: string[]
          conhecimentos: string[]
          created_at: string
          created_by: string | null
          data: string | null
          entrega: string | null
          ferramentas: string[]
          funcao_mapa: string | null
          habilidades: string[]
          id: string
          para_que: string | null
          treinamentos_e_learning: string[]
          treinamentos_presenciais: string[]
          updated_at: string
          versao: string | null
        }
        Insert: {
          atitudes?: string[]
          bubble_id?: string | null
          competencias_especificas?: string[]
          competencias_sernissan?: string[]
          conhecimentos?: string[]
          created_at?: string
          created_by?: string | null
          data?: string | null
          entrega?: string | null
          ferramentas?: string[]
          funcao_mapa?: string | null
          habilidades?: string[]
          id?: string
          para_que?: string | null
          treinamentos_e_learning?: string[]
          treinamentos_presenciais?: string[]
          updated_at?: string
          versao?: string | null
        }
        Update: {
          atitudes?: string[]
          bubble_id?: string | null
          competencias_especificas?: string[]
          competencias_sernissan?: string[]
          conhecimentos?: string[]
          created_at?: string
          created_by?: string | null
          data?: string | null
          entrega?: string | null
          ferramentas?: string[]
          funcao_mapa?: string | null
          habilidades?: string[]
          id?: string
          para_que?: string | null
          treinamentos_e_learning?: string[]
          treinamentos_presenciais?: string[]
          updated_at?: string
          versao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_competencia_mapa2_funcao_mapa_funcao_colaborador_id"
            columns: ["funcao_mapa"]
            isOneToOne: false
            referencedRelation: "funcao_colaborador"
            referencedColumns: ["id"]
          },
        ]
      }
      competencias: {
        Row: {
          bubble_id: string | null
          created_at: string
          created_by: string | null
          id: string
          updated_at: string
        }
        Insert: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      competencias_funcoes: {
        Row: {
          competencias_id: string
          created_at: string
          funcao_colaborador_id: string
        }
        Insert: {
          competencias_id: string
          created_at?: string
          funcao_colaborador_id: string
        }
        Update: {
          competencias_id?: string
          created_at?: string
          funcao_colaborador_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_competencias_funcoes_competencias_id_competencias_id"
            columns: ["competencias_id"]
            isOneToOne: false
            referencedRelation: "competencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_competencias_funcoes_funcao_colaborador_id_funcao_colabor"
            columns: ["funcao_colaborador_id"]
            isOneToOne: false
            referencedRelation: "funcao_colaborador"
            referencedColumns: ["id"]
          },
        ]
      }
      concessionaria: {
        Row: {
          admin_2: string | null
          bir: string | null
          bubble_id: string | null
          categoria: string | null
          codigo_ndp: string | null
          created_at: string
          created_by: string | null
          data_nomeacao: string | null
          divisao: string | null
          dominios: string[]
          empresa: string | null
          estrutura: string | null
          grupo: string | null
          grupo_ndp: string | null
          id: string
          municipio: string | null
          nome: string | null
          pais: string | null
          setor: string | null
          uf: string | null
          updated_at: string
        }
        Insert: {
          admin_2?: string | null
          bir?: string | null
          bubble_id?: string | null
          categoria?: string | null
          codigo_ndp?: string | null
          created_at?: string
          created_by?: string | null
          data_nomeacao?: string | null
          divisao?: string | null
          dominios?: string[]
          empresa?: string | null
          estrutura?: string | null
          grupo?: string | null
          grupo_ndp?: string | null
          id?: string
          municipio?: string | null
          nome?: string | null
          pais?: string | null
          setor?: string | null
          uf?: string | null
          updated_at?: string
        }
        Update: {
          admin_2?: string | null
          bir?: string | null
          bubble_id?: string | null
          categoria?: string | null
          codigo_ndp?: string | null
          created_at?: string
          created_by?: string | null
          data_nomeacao?: string | null
          divisao?: string | null
          dominios?: string[]
          empresa?: string | null
          estrutura?: string | null
          grupo?: string | null
          grupo_ndp?: string | null
          id?: string
          municipio?: string | null
          nome?: string | null
          pais?: string | null
          setor?: string | null
          uf?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_concessionaria_divisao_divisao_id"
            columns: ["divisao"]
            isOneToOne: false
            referencedRelation: "divisao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_concessionaria_empresa_empresa_id"
            columns: ["empresa"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_concessionaria_grupo_grupo_id"
            columns: ["grupo"]
            isOneToOne: false
            referencedRelation: "grupo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_concessionaria_grupo_ndp_grupo_ndp_id"
            columns: ["grupo_ndp"]
            isOneToOne: false
            referencedRelation: "grupo_ndp"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_concessionaria_pais_pais_id"
            columns: ["pais"]
            isOneToOne: false
            referencedRelation: "pais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_concessionaria_setor_setores_id"
            columns: ["setor"]
            isOneToOne: false
            referencedRelation: "setores"
            referencedColumns: ["id"]
          },
        ]
      }
      concessionaria_colaboradores_2: {
        Row: {
          concessionaria_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          concessionaria_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          concessionaria_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_concessionaria_colaboradores_2_concessionaria_id_concessi"
            columns: ["concessionaria_id"]
            isOneToOne: false
            referencedRelation: "concessionaria"
            referencedColumns: ["id"]
          },
        ]
      }
      concessionaria_indicadores: {
        Row: {
          concessionaria_id: string
          created_at: string
          indicadores_id: string
        }
        Insert: {
          concessionaria_id: string
          created_at?: string
          indicadores_id: string
        }
        Update: {
          concessionaria_id?: string
          created_at?: string
          indicadores_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_concessionaria_indicadores_concessionaria_id_concessionar"
            columns: ["concessionaria_id"]
            isOneToOne: false
            referencedRelation: "concessionaria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_concessionaria_indicadores_indicadores_id_indicadores_id"
            columns: ["indicadores_id"]
            isOneToOne: false
            referencedRelation: "indicadores"
            referencedColumns: ["id"]
          },
        ]
      }
      concessionaria_lideres_2: {
        Row: {
          concessionaria_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          concessionaria_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          concessionaria_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_concessionaria_lideres_2_concessionaria_id_concessionaria"
            columns: ["concessionaria_id"]
            isOneToOne: false
            referencedRelation: "concessionaria"
            referencedColumns: ["id"]
          },
        ]
      }
      concessionaria_placars: {
        Row: {
          concessionaria_id: string
          created_at: string
          placar_id: string
        }
        Insert: {
          concessionaria_id: string
          created_at?: string
          placar_id: string
        }
        Update: {
          concessionaria_id?: string
          created_at?: string
          placar_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_concessionaria_placars_concessionaria_id_concessionaria_i"
            columns: ["concessionaria_id"]
            isOneToOne: false
            referencedRelation: "concessionaria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_concessionaria_placars_placar_id_placar_id"
            columns: ["placar_id"]
            isOneToOne: false
            referencedRelation: "placar"
            referencedColumns: ["id"]
          },
        ]
      }
      concessionaria_xr_simulacoes: {
        Row: {
          concessionaria_id: string
          created_at: string
          xr_simulador_id: string
        }
        Insert: {
          concessionaria_id: string
          created_at?: string
          xr_simulador_id: string
        }
        Update: {
          concessionaria_id?: string
          created_at?: string
          xr_simulador_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_concessionaria_xr_simulacoes_concessionaria_id_concession"
            columns: ["concessionaria_id"]
            isOneToOne: false
            referencedRelation: "concessionaria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_concessionaria_xr_simulacoes_xr_simulador_id_xr_simulador"
            columns: ["xr_simulador_id"]
            isOneToOne: false
            referencedRelation: "xr_simulador"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_options: {
        Row: {
          bubble_id: string | null
          created_at: string
          created_by: string | null
          empresa: string | null
          id: string
          manutencao: boolean | null
          manutencao_ate: string | null
          pais: string | null
          termos: string | null
          texto_home: string | null
          updated_at: string
        }
        Insert: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          id?: string
          manutencao?: boolean | null
          manutencao_ate?: string | null
          pais?: string | null
          termos?: string | null
          texto_home?: string | null
          updated_at?: string
        }
        Update: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          id?: string
          manutencao?: boolean | null
          manutencao_ate?: string | null
          pais?: string | null
          termos?: string | null
          texto_home?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_dashboard_options_empresa_empresa_id"
            columns: ["empresa"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_dashboard_options_pais_pais_id"
            columns: ["pais"]
            isOneToOne: false
            referencedRelation: "pais"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_options_faqs: {
        Row: {
          created_at: string
          dashboard_options_id: string
          faq_pergunta_id: string
        }
        Insert: {
          created_at?: string
          dashboard_options_id: string
          faq_pergunta_id: string
        }
        Update: {
          created_at?: string
          dashboard_options_id?: string
          faq_pergunta_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_dashboard_options_faqs_dashboard_options_id_dashboard_opt"
            columns: ["dashboard_options_id"]
            isOneToOne: false
            referencedRelation: "dashboard_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_dashboard_options_faqs_faq_pergunta_id_faq_pergunta_id"
            columns: ["faq_pergunta_id"]
            isOneToOne: false
            referencedRelation: "faq_pergunta"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_options_slides: {
        Row: {
          created_at: string
          dashboard_options_id: string
          slide_options_id: string
        }
        Insert: {
          created_at?: string
          dashboard_options_id: string
          slide_options_id: string
        }
        Update: {
          created_at?: string
          dashboard_options_id?: string
          slide_options_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_dashboard_options_slides_dashboard_options_id_dashboard_o"
            columns: ["dashboard_options_id"]
            isOneToOne: false
            referencedRelation: "dashboard_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_dashboard_options_slides_slide_options_id_slide_options_i"
            columns: ["slide_options_id"]
            isOneToOne: false
            referencedRelation: "slide_options"
            referencedColumns: ["id"]
          },
        ]
      }
      debug: {
        Row: {
          bubble_id: string | null
          conteudo: string | null
          created_at: string
          created_by: string | null
          id: string
          updated_at: string
        }
        Insert: {
          bubble_id?: string | null
          conteudo?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          bubble_id?: string | null
          conteudo?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      divisao: {
        Row: {
          bubble_id: string | null
          created_at: string
          created_by: string | null
          empresa: string | null
          id: string
          id_2: string | null
          nome: string | null
          pais: string | null
          updated_at: string
        }
        Insert: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          id?: string
          id_2?: string | null
          nome?: string | null
          pais?: string | null
          updated_at?: string
        }
        Update: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          id?: string
          id_2?: string | null
          nome?: string | null
          pais?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_divisao_empresa_empresa_id"
            columns: ["empresa"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_divisao_pais_pais_id"
            columns: ["pais"]
            isOneToOne: false
            referencedRelation: "pais"
            referencedColumns: ["id"]
          },
        ]
      }
      divisao_setores: {
        Row: {
          created_at: string
          divisao_id: string
          setores_id: string
        }
        Insert: {
          created_at?: string
          divisao_id: string
          setores_id: string
        }
        Update: {
          created_at?: string
          divisao_id?: string
          setores_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_divisao_setores_divisao_id_divisao_id"
            columns: ["divisao_id"]
            isOneToOne: false
            referencedRelation: "divisao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_divisao_setores_setores_id_setores_id"
            columns: ["setores_id"]
            isOneToOne: false
            referencedRelation: "setores"
            referencedColumns: ["id"]
          },
        ]
      }
      empresa: {
        Row: {
          bubble_id: string | null
          check_emails: boolean | null
          cor_principal: string | null
          cor_secundaria: string | null
          created_at: string
          created_by: string | null
          email: string | null
          fone: string | null
          id: string
          logo: string | null
          logo_dark: string | null
          logo_mobile: string | null
          logo_white: string | null
          nome: string | null
          updated_at: string
        }
        Insert: {
          bubble_id?: string | null
          check_emails?: boolean | null
          cor_principal?: string | null
          cor_secundaria?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          fone?: string | null
          id?: string
          logo?: string | null
          logo_dark?: string | null
          logo_mobile?: string | null
          logo_white?: string | null
          nome?: string | null
          updated_at?: string
        }
        Update: {
          bubble_id?: string | null
          check_emails?: boolean | null
          cor_principal?: string | null
          cor_secundaria?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          fone?: string | null
          id?: string
          logo?: string | null
          logo_dark?: string | null
          logo_mobile?: string | null
          logo_white?: string | null
          nome?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      empresa_pais: {
        Row: {
          created_at: string
          empresa_id: string
          pais_id: string
        }
        Insert: {
          created_at?: string
          empresa_id: string
          pais_id: string
        }
        Update: {
          created_at?: string
          empresa_id?: string
          pais_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_empresa_pais_empresa_id_empresa_id"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_empresa_pais_pais_id_pais_id"
            columns: ["pais_id"]
            isOneToOne: false
            referencedRelation: "pais"
            referencedColumns: ["id"]
          },
        ]
      }
      faq_pergunta: {
        Row: {
          bubble_id: string | null
          categoria: string | null
          created_at: string
          created_by: string | null
          empresa: string | null
          id: string
          pergunta: string | null
          resposta: string | null
          updated_at: string
        }
        Insert: {
          bubble_id?: string | null
          categoria?: string | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          id?: string
          pergunta?: string | null
          resposta?: string | null
          updated_at?: string
        }
        Update: {
          bubble_id?: string | null
          categoria?: string | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          id?: string
          pergunta?: string | null
          resposta?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_faq_pergunta_empresa_empresa_id"
            columns: ["empresa"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          bubble_id: string | null
          colaborador_2: string | null
          created_at: string
          created_by: string | null
          empresa: string | null
          id: string
          placar: string | null
          texto: string | null
          updated_at: string
        }
        Insert: {
          bubble_id?: string | null
          colaborador_2?: string | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          id?: string
          placar?: string | null
          texto?: string | null
          updated_at?: string
        }
        Update: {
          bubble_id?: string | null
          colaborador_2?: string | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          id?: string
          placar?: string | null
          texto?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_feedback_empresa_empresa_id"
            columns: ["empresa"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_feedback_placar_placar_id"
            columns: ["placar"]
            isOneToOne: false
            referencedRelation: "placar"
            referencedColumns: ["id"]
          },
        ]
      }
      funcao_colaborador: {
        Row: {
          area: string | null
          bubble_id: string | null
          chave: boolean | null
          created_at: string
          created_by: string | null
          empresa: string | null
          id: string
          lideranca: boolean | null
          nome: string | null
          updated_at: string
        }
        Insert: {
          area?: string | null
          bubble_id?: string | null
          chave?: boolean | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          id?: string
          lideranca?: boolean | null
          nome?: string | null
          updated_at?: string
        }
        Update: {
          area?: string | null
          bubble_id?: string | null
          chave?: boolean | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          id?: string
          lideranca?: boolean | null
          nome?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_funcao_colaborador_area_setor_concessionaria_id"
            columns: ["area"]
            isOneToOne: false
            referencedRelation: "setor_concessionaria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_funcao_colaborador_empresa_empresa_id"
            columns: ["empresa"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      grupo: {
        Row: {
          admin_2: string | null
          bubble_id: string | null
          created_at: string
          created_by: string | null
          empresa: string | null
          grupo_ndp: string | null
          id: string
          id_2: string | null
          nome: string | null
          setor: string | null
          updated_at: string
        }
        Insert: {
          admin_2?: string | null
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          grupo_ndp?: string | null
          id?: string
          id_2?: string | null
          nome?: string | null
          setor?: string | null
          updated_at?: string
        }
        Update: {
          admin_2?: string | null
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          grupo_ndp?: string | null
          id?: string
          id_2?: string | null
          nome?: string | null
          setor?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_grupo_empresa_empresa_id"
            columns: ["empresa"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_grupo_grupo_ndp_grupo_ndp_id"
            columns: ["grupo_ndp"]
            isOneToOne: false
            referencedRelation: "grupo_ndp"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_grupo_setor_setores_id"
            columns: ["setor"]
            isOneToOne: false
            referencedRelation: "setores"
            referencedColumns: ["id"]
          },
        ]
      }
      grupo_concessionarias: {
        Row: {
          concessionaria_id: string
          created_at: string
          grupo_id: string
        }
        Insert: {
          concessionaria_id: string
          created_at?: string
          grupo_id: string
        }
        Update: {
          concessionaria_id?: string
          created_at?: string
          grupo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_grupo_concessionarias_concessionaria_id_concessionaria_id"
            columns: ["concessionaria_id"]
            isOneToOne: false
            referencedRelation: "concessionaria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_grupo_concessionarias_grupo_id_grupo_id"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupo"
            referencedColumns: ["id"]
          },
        ]
      }
      grupo_ndp: {
        Row: {
          bubble_id: string | null
          created_at: string
          created_by: string | null
          empresa: string | null
          grupo: string | null
          id: string
          id_2: string | null
          nome: string | null
          setor: string | null
          updated_at: string
        }
        Insert: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          grupo?: string | null
          id?: string
          id_2?: string | null
          nome?: string | null
          setor?: string | null
          updated_at?: string
        }
        Update: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          grupo?: string | null
          id?: string
          id_2?: string | null
          nome?: string | null
          setor?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_grupo_ndp_empresa_empresa_id"
            columns: ["empresa"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_grupo_ndp_grupo_grupo_id"
            columns: ["grupo"]
            isOneToOne: false
            referencedRelation: "grupo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_grupo_ndp_setor_setores_id"
            columns: ["setor"]
            isOneToOne: false
            referencedRelation: "setores"
            referencedColumns: ["id"]
          },
        ]
      }
      habitos: {
        Row: {
          bubble_id: string | null
          created_at: string
          created_by: string | null
          id: string
          updated_at: string
        }
        Insert: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      indicadores: {
        Row: {
          agendamento: string | null
          api_id: string | null
          area: string | null
          ativo: boolean | null
          ativo_placar: boolean | null
          bubble_id: string | null
          classe: string | null
          colaborador_user: string | null
          concessionaria: string | null
          created_at: string
          created_by: string | null
          customizado: boolean | null
          empresa: string | null
          feedback: string | null
          funcao: string | null
          id: string
          importancia: string | null
          meta: number | null
          meta_customizada: boolean | null
          meta_customizada_justificativa: string | null
          nome: string | null
          ordem: number | null
          placar: string | null
          placar_count: number | null
          placar_ranking: number | null
          pontos: number | null
          pontos_ranking: number | null
          sigla: string | null
          status_adm: string | null
          unidade: string | null
          updated_at: string
          user: string | null
          user_edicao: string | null
          valor: number | null
        }
        Insert: {
          agendamento?: string | null
          api_id?: string | null
          area?: string | null
          ativo?: boolean | null
          ativo_placar?: boolean | null
          bubble_id?: string | null
          classe?: string | null
          colaborador_user?: string | null
          concessionaria?: string | null
          created_at?: string
          created_by?: string | null
          customizado?: boolean | null
          empresa?: string | null
          feedback?: string | null
          funcao?: string | null
          id?: string
          importancia?: string | null
          meta?: number | null
          meta_customizada?: boolean | null
          meta_customizada_justificativa?: string | null
          nome?: string | null
          ordem?: number | null
          placar?: string | null
          placar_count?: number | null
          placar_ranking?: number | null
          pontos?: number | null
          pontos_ranking?: number | null
          sigla?: string | null
          status_adm?: string | null
          unidade?: string | null
          updated_at?: string
          user?: string | null
          user_edicao?: string | null
          valor?: number | null
        }
        Update: {
          agendamento?: string | null
          api_id?: string | null
          area?: string | null
          ativo?: boolean | null
          ativo_placar?: boolean | null
          bubble_id?: string | null
          classe?: string | null
          colaborador_user?: string | null
          concessionaria?: string | null
          created_at?: string
          created_by?: string | null
          customizado?: boolean | null
          empresa?: string | null
          feedback?: string | null
          funcao?: string | null
          id?: string
          importancia?: string | null
          meta?: number | null
          meta_customizada?: boolean | null
          meta_customizada_justificativa?: string | null
          nome?: string | null
          ordem?: number | null
          placar?: string | null
          placar_count?: number | null
          placar_ranking?: number | null
          pontos?: number | null
          pontos_ranking?: number | null
          sigla?: string | null
          status_adm?: string | null
          unidade?: string | null
          updated_at?: string
          user?: string | null
          user_edicao?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_indicadores_agendamento_agendamentos_id"
            columns: ["agendamento"]
            isOneToOne: false
            referencedRelation: "agendamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_indicadores_area_setor_concessionaria_id"
            columns: ["area"]
            isOneToOne: false
            referencedRelation: "setor_concessionaria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_indicadores_concessionaria_concessionaria_id"
            columns: ["concessionaria"]
            isOneToOne: false
            referencedRelation: "concessionaria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_indicadores_empresa_empresa_id"
            columns: ["empresa"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_indicadores_feedback_feedback_id"
            columns: ["feedback"]
            isOneToOne: false
            referencedRelation: "feedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_indicadores_funcao_funcao_colaborador_id"
            columns: ["funcao"]
            isOneToOne: false
            referencedRelation: "funcao_colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_indicadores_placar_placar_id"
            columns: ["placar"]
            isOneToOne: false
            referencedRelation: "placar"
            referencedColumns: ["id"]
          },
        ]
      }
      indicadores_areas: {
        Row: {
          created_at: string
          indicadores_id: string
          setor_concessionaria_id: string
        }
        Insert: {
          created_at?: string
          indicadores_id: string
          setor_concessionaria_id: string
        }
        Update: {
          created_at?: string
          indicadores_id?: string
          setor_concessionaria_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_indicadores_areas_indicadores_id_indicadores_id"
            columns: ["indicadores_id"]
            isOneToOne: false
            referencedRelation: "indicadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_indicadores_areas_setor_concessionaria_id_setor_concessio"
            columns: ["setor_concessionaria_id"]
            isOneToOne: false
            referencedRelation: "setor_concessionaria"
            referencedColumns: ["id"]
          },
        ]
      }
      indicadores_funcoes: {
        Row: {
          created_at: string
          funcao_colaborador_id: string
          indicadores_id: string
        }
        Insert: {
          created_at?: string
          funcao_colaborador_id: string
          indicadores_id: string
        }
        Update: {
          created_at?: string
          funcao_colaborador_id?: string
          indicadores_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_indicadores_funcoes_funcao_colaborador_id_funcao_colabora"
            columns: ["funcao_colaborador_id"]
            isOneToOne: false
            referencedRelation: "funcao_colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_indicadores_funcoes_indicadores_id_indicadores_id"
            columns: ["indicadores_id"]
            isOneToOne: false
            referencedRelation: "indicadores"
            referencedColumns: ["id"]
          },
        ]
      }
      instru_es: {
        Row: {
          bubble_id: string | null
          created_at: string
          created_by: string | null
          id: string
          lista: string[]
          tipo: string | null
          titulo: string | null
          updated_at: string
        }
        Insert: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          lista?: string[]
          tipo?: string | null
          titulo?: string | null
          updated_at?: string
        }
        Update: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          lista?: string[]
          tipo?: string | null
          titulo?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      loh: {
        Row: {
          action: string | null
          bubble_id: string | null
          concessionaria: string | null
          created_at: string
          created_by: string | null
          id: string
          text: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          action?: string | null
          bubble_id?: string | null
          concessionaria?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          text?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          action?: string | null
          bubble_id?: string | null
          concessionaria?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          text?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_loh_concessionaria_concessionaria_id"
            columns: ["concessionaria"]
            isOneToOne: false
            referencedRelation: "concessionaria"
            referencedColumns: ["id"]
          },
        ]
      }
      pais: {
        Row: {
          bubble_id: string | null
          created_at: string
          created_by: string | null
          dashboard_options: string | null
          empresa: string | null
          id: string
          id_2: string | null
          nome: string | null
          updated_at: string
        }
        Insert: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          dashboard_options?: string | null
          empresa?: string | null
          id?: string
          id_2?: string | null
          nome?: string | null
          updated_at?: string
        }
        Update: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          dashboard_options?: string | null
          empresa?: string | null
          id?: string
          id_2?: string | null
          nome?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_pais_dashboard_options_dashboard_options_id"
            columns: ["dashboard_options"]
            isOneToOne: false
            referencedRelation: "dashboard_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pais_empresa_empresa_id"
            columns: ["empresa"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      pais_divisoes: {
        Row: {
          created_at: string
          divisao_id: string
          pais_id: string
        }
        Insert: {
          created_at?: string
          divisao_id: string
          pais_id: string
        }
        Update: {
          created_at?: string
          divisao_id?: string
          pais_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_pais_divisoes_divisao_id_divisao_id"
            columns: ["divisao_id"]
            isOneToOne: false
            referencedRelation: "divisao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pais_divisoes_pais_id_pais_id"
            columns: ["pais_id"]
            isOneToOne: false
            referencedRelation: "pais"
            referencedColumns: ["id"]
          },
        ]
      }
      placar: {
        Row: {
          bubble_id: string | null
          concessionaria: string | null
          created_at: string
          created_by: string | null
          data: string | null
          empresa: string | null
          finalizado: boolean | null
          id: string
          opcao_acumulado: string | null
          opcao_origem: string | null
          ranking_atualizado: boolean | null
          updated_at: string
        }
        Insert: {
          bubble_id?: string | null
          concessionaria?: string | null
          created_at?: string
          created_by?: string | null
          data?: string | null
          empresa?: string | null
          finalizado?: boolean | null
          id?: string
          opcao_acumulado?: string | null
          opcao_origem?: string | null
          ranking_atualizado?: boolean | null
          updated_at?: string
        }
        Update: {
          bubble_id?: string | null
          concessionaria?: string | null
          created_at?: string
          created_by?: string | null
          data?: string | null
          empresa?: string | null
          finalizado?: boolean | null
          id?: string
          opcao_acumulado?: string | null
          opcao_origem?: string | null
          ranking_atualizado?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_placar_concessionaria_concessionaria_id"
            columns: ["concessionaria"]
            isOneToOne: false
            referencedRelation: "concessionaria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_placar_empresa_empresa_id"
            columns: ["empresa"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      placar_colaboradores_start: {
        Row: {
          created_at: string
          placar_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          placar_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          placar_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_placar_colaboradores_start_placar_id_placar_id"
            columns: ["placar_id"]
            isOneToOne: false
            referencedRelation: "placar"
            referencedColumns: ["id"]
          },
        ]
      }
      placar_exclus_o: {
        Row: {
          bubble_id: string | null
          concessionaria: string | null
          created_at: string
          created_by: string | null
          data_criacao: string | null
          data_exclusao: string | null
          empresa: string | null
          id: string
          nome: string | null
          updated_at: string
          user_criacao: string | null
          user_exclusao: string | null
        }
        Insert: {
          bubble_id?: string | null
          concessionaria?: string | null
          created_at?: string
          created_by?: string | null
          data_criacao?: string | null
          data_exclusao?: string | null
          empresa?: string | null
          id?: string
          nome?: string | null
          updated_at?: string
          user_criacao?: string | null
          user_exclusao?: string | null
        }
        Update: {
          bubble_id?: string | null
          concessionaria?: string | null
          created_at?: string
          created_by?: string | null
          data_criacao?: string | null
          data_exclusao?: string | null
          empresa?: string | null
          id?: string
          nome?: string | null
          updated_at?: string
          user_criacao?: string | null
          user_exclusao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_placar_exclus_o_concessionaria_concessionaria_id"
            columns: ["concessionaria"]
            isOneToOne: false
            referencedRelation: "concessionaria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_placar_exclus_o_empresa_empresa_id"
            columns: ["empresa"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      placar_indicadores: {
        Row: {
          created_at: string
          indicadores_id: string
          placar_id: string
        }
        Insert: {
          created_at?: string
          indicadores_id: string
          placar_id: string
        }
        Update: {
          created_at?: string
          indicadores_id?: string
          placar_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_placar_indicadores_indicadores_id_indicadores_id"
            columns: ["indicadores_id"]
            isOneToOne: false
            referencedRelation: "indicadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_placar_indicadores_placar_id_placar_id"
            columns: ["placar_id"]
            isOneToOne: false
            referencedRelation: "placar"
            referencedColumns: ["id"]
          },
        ]
      }
      placar_indicadores_start: {
        Row: {
          created_at: string
          indicadores_id: string
          placar_id: string
        }
        Insert: {
          created_at?: string
          indicadores_id: string
          placar_id: string
        }
        Update: {
          created_at?: string
          indicadores_id?: string
          placar_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_placar_indicadores_start_indicadores_id_indicadores_id"
            columns: ["indicadores_id"]
            isOneToOne: false
            referencedRelation: "indicadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_placar_indicadores_start_placar_id_placar_id"
            columns: ["placar_id"]
            isOneToOne: false
            referencedRelation: "placar"
            referencedColumns: ["id"]
          },
        ]
      }
      placar_recalculation_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          placar_id: string
          profile_id: string | null
          summary: Json
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          placar_id: string
          profile_id?: string | null
          summary?: Json
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          placar_id?: string
          profile_id?: string | null
          summary?: Json
        }
        Relationships: [
          {
            foreignKeyName: "placar_recalculation_logs_placar_id_fkey"
            columns: ["placar_id"]
            isOneToOne: false
            referencedRelation: "placar"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          aprovado: boolean | null
          area: string | null
          ativo: boolean | null
          ativo_placar: boolean | null
          changed: string | null
          concessionaria: string | null
          convite_enviado: boolean | null
          cookies_pp_displayed: boolean | null
          cpf_text: string | null
          created_at: string
          divisao: string | null
          dominio: string | null
          empresa: string | null
          foto: string | null
          funcao: string | null
          grupo: string | null
          id: string
          last_update: string | null
          mover_equipe: boolean | null
          nome: string | null
          novo_acesso: string | null
          pais: string | null
          perfil: string | null
          responsavel: string | null
          setor: string | null
          ultima_funcao_placar: string | null
          ultimo_acesso: string | null
          ultimo_placar: string | null
          updated_at: string
          videos_temp: string[]
        }
        Insert: {
          aprovado?: boolean | null
          area?: string | null
          ativo?: boolean | null
          ativo_placar?: boolean | null
          changed?: string | null
          concessionaria?: string | null
          convite_enviado?: boolean | null
          cookies_pp_displayed?: boolean | null
          cpf_text?: string | null
          created_at?: string
          divisao?: string | null
          dominio?: string | null
          empresa?: string | null
          foto?: string | null
          funcao?: string | null
          grupo?: string | null
          id: string
          last_update?: string | null
          mover_equipe?: boolean | null
          nome?: string | null
          novo_acesso?: string | null
          pais?: string | null
          perfil?: string | null
          responsavel?: string | null
          setor?: string | null
          ultima_funcao_placar?: string | null
          ultimo_acesso?: string | null
          ultimo_placar?: string | null
          updated_at?: string
          videos_temp?: string[]
        }
        Update: {
          aprovado?: boolean | null
          area?: string | null
          ativo?: boolean | null
          ativo_placar?: boolean | null
          changed?: string | null
          concessionaria?: string | null
          convite_enviado?: boolean | null
          cookies_pp_displayed?: boolean | null
          cpf_text?: string | null
          created_at?: string
          divisao?: string | null
          dominio?: string | null
          empresa?: string | null
          foto?: string | null
          funcao?: string | null
          grupo?: string | null
          id?: string
          last_update?: string | null
          mover_equipe?: boolean | null
          nome?: string | null
          novo_acesso?: string | null
          pais?: string | null
          perfil?: string | null
          responsavel?: string | null
          setor?: string | null
          ultima_funcao_placar?: string | null
          ultimo_acesso?: string | null
          ultimo_placar?: string | null
          updated_at?: string
          videos_temp?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_area_setor_concessionaria_id"
            columns: ["area"]
            isOneToOne: false
            referencedRelation: "setor_concessionaria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_profiles_concessionaria_concessionaria_id"
            columns: ["concessionaria"]
            isOneToOne: false
            referencedRelation: "concessionaria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_profiles_divisao_divisao_id"
            columns: ["divisao"]
            isOneToOne: false
            referencedRelation: "divisao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_profiles_empresa_empresa_id"
            columns: ["empresa"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_profiles_funcao_funcao_colaborador_id"
            columns: ["funcao"]
            isOneToOne: false
            referencedRelation: "funcao_colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_profiles_grupo_grupo_id"
            columns: ["grupo"]
            isOneToOne: false
            referencedRelation: "grupo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_profiles_pais_pais_id"
            columns: ["pais"]
            isOneToOne: false
            referencedRelation: "pais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_profiles_setor_setores_id"
            columns: ["setor"]
            isOneToOne: false
            referencedRelation: "setores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_profiles_ultima_funcao_placar_funcao_colaborador_id"
            columns: ["ultima_funcao_placar"]
            isOneToOne: false
            referencedRelation: "funcao_colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_profiles_ultimo_placar_placar_id"
            columns: ["ultimo_placar"]
            isOneToOne: false
            referencedRelation: "placar"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles_areas_disponiveis: {
        Row: {
          created_at: string
          profiles_id: string
          setor_concessionaria_id: string
        }
        Insert: {
          created_at?: string
          profiles_id: string
          setor_concessionaria_id: string
        }
        Update: {
          created_at?: string
          profiles_id?: string
          setor_concessionaria_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_areas_disponiveis_profiles_id_profiles_id"
            columns: ["profiles_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_profiles_areas_disponiveis_setor_concessionaria_id_setor_"
            columns: ["setor_concessionaria_id"]
            isOneToOne: false
            referencedRelation: "setor_concessionaria"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles_concessionarias_equipe: {
        Row: {
          concessionaria_id: string
          created_at: string
          profiles_id: string
        }
        Insert: {
          concessionaria_id: string
          created_at?: string
          profiles_id: string
        }
        Update: {
          concessionaria_id?: string
          created_at?: string
          profiles_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_concessionarias_equipe_concessionaria_id_concess"
            columns: ["concessionaria_id"]
            isOneToOne: false
            referencedRelation: "concessionaria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_profiles_concessionarias_equipe_profiles_id_profiles_id"
            columns: ["profiles_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles_grupos_disponiveis: {
        Row: {
          created_at: string
          grupo_id: string
          profiles_id: string
        }
        Insert: {
          created_at?: string
          grupo_id: string
          profiles_id: string
        }
        Update: {
          created_at?: string
          grupo_id?: string
          profiles_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_grupos_disponiveis_grupo_id_grupo_id"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_profiles_grupos_disponiveis_profiles_id_profiles_id"
            columns: ["profiles_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rr_indicadores: {
        Row: {
          ano_fiscal: string | null
          api_1: string | null
          api_2: string | null
          api_3: string | null
          api_4: string | null
          api_5: string | null
          api_6: string | null
          area: string | null
          bubble_id: string | null
          created_at: string
          created_by: string | null
          empresa: string | null
          id: string
          metas: string[]
          nome: string | null
          pontos: string | null
          preliminar: string | null
          sort: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          ano_fiscal?: string | null
          api_1?: string | null
          api_2?: string | null
          api_3?: string | null
          api_4?: string | null
          api_5?: string | null
          api_6?: string | null
          area?: string | null
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          id?: string
          metas?: string[]
          nome?: string | null
          pontos?: string | null
          preliminar?: string | null
          sort?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          ano_fiscal?: string | null
          api_1?: string | null
          api_2?: string | null
          api_3?: string | null
          api_4?: string | null
          api_5?: string | null
          api_6?: string | null
          area?: string | null
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          id?: string
          metas?: string[]
          nome?: string | null
          pontos?: string | null
          preliminar?: string | null
          sort?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_rr_indicadores_area_xr_tipo_indicador_id"
            columns: ["area"]
            isOneToOne: false
            referencedRelation: "xr_tipo_indicador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_rr_indicadores_empresa_empresa_id"
            columns: ["empresa"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_rr_indicadores_preliminar_xr_placar_id"
            columns: ["preliminar"]
            isOneToOne: false
            referencedRelation: "xr_placar"
            referencedColumns: ["id"]
          },
        ]
      }
      rr_indicadores_xr_metas: {
        Row: {
          created_at: string
          rr_indicadores_id: string
          xr_meta_id: string
        }
        Insert: {
          created_at?: string
          rr_indicadores_id: string
          xr_meta_id: string
        }
        Update: {
          created_at?: string
          rr_indicadores_id?: string
          xr_meta_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_rr_indicadores_xr_metas_rr_indicadores_id_rr_indicadores_"
            columns: ["rr_indicadores_id"]
            isOneToOne: false
            referencedRelation: "rr_indicadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_rr_indicadores_xr_metas_xr_meta_id_xr_meta_id"
            columns: ["xr_meta_id"]
            isOneToOne: false
            referencedRelation: "xr_meta"
            referencedColumns: ["id"]
          },
        ]
      }
      rv: {
        Row: {
          assinado_em: string | null
          avaliacao_consultor: string | null
          bloqueado_edicao: boolean | null
          bubble_id: string | null
          comentario_ciencia: string | null
          consultor: string | null
          created_at: string
          created_by: string | null
          data_expiracao_token: string | null
          data_visita: string | null
          dealer: string | null
          enviado_em: string | null
          foco: string | null
          hash_assinatura: string | null
          hora_fim: string | null
          hora_inicio: string | null
          id: string
          ip_assinatura: string | null
          modalidade: string | null
          operador_assinante: string | null
          pontos_destaque: string | null
          relato: string | null
          status: string | null
          token_ciencia: string | null
          updated_at: string
          user_agent_assinatura: string | null
        }
        Insert: {
          assinado_em?: string | null
          avaliacao_consultor?: string | null
          bloqueado_edicao?: boolean | null
          bubble_id?: string | null
          comentario_ciencia?: string | null
          consultor?: string | null
          created_at?: string
          created_by?: string | null
          data_expiracao_token?: string | null
          data_visita?: string | null
          dealer?: string | null
          enviado_em?: string | null
          foco?: string | null
          hash_assinatura?: string | null
          hora_fim?: string | null
          hora_inicio?: string | null
          id?: string
          ip_assinatura?: string | null
          modalidade?: string | null
          operador_assinante?: string | null
          pontos_destaque?: string | null
          relato?: string | null
          status?: string | null
          token_ciencia?: string | null
          updated_at?: string
          user_agent_assinatura?: string | null
        }
        Update: {
          assinado_em?: string | null
          avaliacao_consultor?: string | null
          bloqueado_edicao?: boolean | null
          bubble_id?: string | null
          comentario_ciencia?: string | null
          consultor?: string | null
          created_at?: string
          created_by?: string | null
          data_expiracao_token?: string | null
          data_visita?: string | null
          dealer?: string | null
          enviado_em?: string | null
          foco?: string | null
          hash_assinatura?: string | null
          hora_fim?: string | null
          hora_inicio?: string | null
          id?: string
          ip_assinatura?: string | null
          modalidade?: string | null
          operador_assinante?: string | null
          pontos_destaque?: string | null
          relato?: string | null
          status?: string | null
          token_ciencia?: string | null
          updated_at?: string
          user_agent_assinatura?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_rv_dealer_concessionaria_id"
            columns: ["dealer"]
            isOneToOne: false
            referencedRelation: "concessionaria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_rv_foco_rv_foco_id"
            columns: ["foco"]
            isOneToOne: false
            referencedRelation: "rv_foco"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_rv_modalidade_rv_modalidade_id"
            columns: ["modalidade"]
            isOneToOne: false
            referencedRelation: "rv_modalidade"
            referencedColumns: ["id"]
          },
        ]
      }
      rv_anexo: {
        Row: {
          arquivo: string | null
          bubble_id: string | null
          created_at: string
          created_by: string | null
          id: string
          nome: string | null
          rv: string | null
          tamanho_mb: number | null
          tipo: string | null
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          arquivo?: string | null
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          nome?: string | null
          rv?: string | null
          tamanho_mb?: number | null
          tipo?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          arquivo?: string | null
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          nome?: string | null
          rv?: string | null
          tamanho_mb?: number | null
          tipo?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_rv_anexo_rv_rv_id"
            columns: ["rv"]
            isOneToOne: false
            referencedRelation: "rv"
            referencedColumns: ["id"]
          },
        ]
      }
      rv_assinatura: {
        Row: {
          assinante_cargo: string | null
          assinante_nome: string | null
          assinante_user: string | null
          bubble_id: string | null
          comentario: string | null
          created_at: string
          created_by: string | null
          data_hora_utc: string | null
          dealer: string | null
          hash_sha256: string | null
          id: string
          ip: string | null
          rv: string | null
          token_usado: string | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          assinante_cargo?: string | null
          assinante_nome?: string | null
          assinante_user?: string | null
          bubble_id?: string | null
          comentario?: string | null
          created_at?: string
          created_by?: string | null
          data_hora_utc?: string | null
          dealer?: string | null
          hash_sha256?: string | null
          id?: string
          ip?: string | null
          rv?: string | null
          token_usado?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          assinante_cargo?: string | null
          assinante_nome?: string | null
          assinante_user?: string | null
          bubble_id?: string | null
          comentario?: string | null
          created_at?: string
          created_by?: string | null
          data_hora_utc?: string | null
          dealer?: string | null
          hash_sha256?: string | null
          id?: string
          ip?: string | null
          rv?: string | null
          token_usado?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_rv_assinatura_dealer_concessionaria_id"
            columns: ["dealer"]
            isOneToOne: false
            referencedRelation: "concessionaria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_rv_assinatura_rv_rv_id"
            columns: ["rv"]
            isOneToOne: false
            referencedRelation: "rv"
            referencedColumns: ["id"]
          },
        ]
      }
      rv_auditoria: {
        Row: {
          acao: string | null
          bubble_id: string | null
          created_at: string
          created_by: string | null
          data: string | null
          descricao: string | null
          id: string
          rv: string | null
          snapshot_json: string | null
          updated_at: string
          user: string | null
        }
        Insert: {
          acao?: string | null
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          data?: string | null
          descricao?: string | null
          id?: string
          rv?: string | null
          snapshot_json?: string | null
          updated_at?: string
          user?: string | null
        }
        Update: {
          acao?: string | null
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          data?: string | null
          descricao?: string | null
          id?: string
          rv?: string | null
          snapshot_json?: string | null
          updated_at?: string
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_rv_auditoria_rv_rv_id"
            columns: ["rv"]
            isOneToOne: false
            referencedRelation: "rv"
            referencedColumns: ["id"]
          },
        ]
      }
      rv_foco: {
        Row: {
          ativo_bool: boolean | null
          bubble_id: string | null
          created_at: string
          created_by: string | null
          id: string
          nome: string | null
          ordem: number | null
          updated_at: string
        }
        Insert: {
          ativo_bool?: boolean | null
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          nome?: string | null
          ordem?: number | null
          updated_at?: string
        }
        Update: {
          ativo_bool?: boolean | null
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          nome?: string | null
          ordem?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      rv_gerentes_copia: {
        Row: {
          created_at: string
          rv_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          rv_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          rv_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_rv_gerentes_copia_rv_id_rv_id"
            columns: ["rv_id"]
            isOneToOne: false
            referencedRelation: "rv"
            referencedColumns: ["id"]
          },
        ]
      }
      rv_modalidade: {
        Row: {
          ativo_bool: boolean | null
          bubble_id: string | null
          created_at: string
          created_by: string | null
          id: string
          nome: string | null
          ordem: number | null
          updated_at: string
        }
        Insert: {
          ativo_bool?: boolean | null
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          nome?: string | null
          ordem?: number | null
          updated_at?: string
        }
        Update: {
          ativo_bool?: boolean | null
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          nome?: string | null
          ordem?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      rv_participante: {
        Row: {
          bubble_id: string | null
          cargo: string | null
          created_at: string
          created_by: string | null
          id: string
          nome: string | null
          ordem: number | null
          rv: string | null
          updated_at: string
        }
        Insert: {
          bubble_id?: string | null
          cargo?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          nome?: string | null
          ordem?: number | null
          rv?: string | null
          updated_at?: string
        }
        Update: {
          bubble_id?: string | null
          cargo?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          nome?: string | null
          ordem?: number | null
          rv?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_rv_participante_rv_rv_id"
            columns: ["rv"]
            isOneToOne: false
            referencedRelation: "rv"
            referencedColumns: ["id"]
          },
        ]
      }
      rv_proximo_passo: {
        Row: {
          acao: string | null
          bubble_id: string | null
          concluido_bool: boolean | null
          created_at: string
          created_by: string | null
          id: string
          ordem: number | null
          prazo: string | null
          responsavel: string | null
          rv: string | null
          updated_at: string
        }
        Insert: {
          acao?: string | null
          bubble_id?: string | null
          concluido_bool?: boolean | null
          created_at?: string
          created_by?: string | null
          id?: string
          ordem?: number | null
          prazo?: string | null
          responsavel?: string | null
          rv?: string | null
          updated_at?: string
        }
        Update: {
          acao?: string | null
          bubble_id?: string | null
          concluido_bool?: boolean | null
          created_at?: string
          created_by?: string | null
          id?: string
          ordem?: number | null
          prazo?: string | null
          responsavel?: string | null
          rv?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_rv_proximo_passo_rv_rv_id"
            columns: ["rv"]
            isOneToOne: false
            referencedRelation: "rv"
            referencedColumns: ["id"]
          },
        ]
      }
      setor_concessionaria: {
        Row: {
          bubble_id: string | null
          created_at: string
          created_by: string | null
          empresa: string | null
          id: string
          nome: string | null
          updated_at: string
        }
        Insert: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          id?: string
          nome?: string | null
          updated_at?: string
        }
        Update: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          id?: string
          nome?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_setor_concessionaria_empresa_empresa_id"
            columns: ["empresa"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      setor_concessionaria_funcoes: {
        Row: {
          created_at: string
          funcao_colaborador_id: string
          setor_concessionaria_id: string
        }
        Insert: {
          created_at?: string
          funcao_colaborador_id: string
          setor_concessionaria_id: string
        }
        Update: {
          created_at?: string
          funcao_colaborador_id?: string
          setor_concessionaria_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_setor_concessionaria_funcoes_funcao_colaborador_id_funcao"
            columns: ["funcao_colaborador_id"]
            isOneToOne: false
            referencedRelation: "funcao_colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_setor_concessionaria_funcoes_setor_concessionaria_id_seto"
            columns: ["setor_concessionaria_id"]
            isOneToOne: false
            referencedRelation: "setor_concessionaria"
            referencedColumns: ["id"]
          },
        ]
      }
      setores: {
        Row: {
          admin_2: string | null
          bubble_id: string | null
          created_at: string
          created_by: string | null
          divisao: string | null
          empresa: string | null
          id: string
          id_2: string | null
          nome: string | null
          updated_at: string
        }
        Insert: {
          admin_2?: string | null
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          divisao?: string | null
          empresa?: string | null
          id?: string
          id_2?: string | null
          nome?: string | null
          updated_at?: string
        }
        Update: {
          admin_2?: string | null
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          divisao?: string | null
          empresa?: string | null
          id?: string
          id_2?: string | null
          nome?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_setores_divisao_divisao_id"
            columns: ["divisao"]
            isOneToOne: false
            referencedRelation: "divisao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_setores_empresa_empresa_id"
            columns: ["empresa"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      setores_grupos: {
        Row: {
          created_at: string
          grupo_id: string
          setores_id: string
        }
        Insert: {
          created_at?: string
          grupo_id: string
          setores_id: string
        }
        Update: {
          created_at?: string
          grupo_id?: string
          setores_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_setores_grupos_grupo_id_grupo_id"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_setores_grupos_setores_id_setores_id"
            columns: ["setores_id"]
            isOneToOne: false
            referencedRelation: "setores"
            referencedColumns: ["id"]
          },
        ]
      }
      setores_grupos_ndp: {
        Row: {
          created_at: string
          grupo_ndp_id: string
          setores_id: string
        }
        Insert: {
          created_at?: string
          grupo_ndp_id: string
          setores_id: string
        }
        Update: {
          created_at?: string
          grupo_ndp_id?: string
          setores_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_setores_grupos_ndp_grupo_ndp_id_grupo_ndp_id"
            columns: ["grupo_ndp_id"]
            isOneToOne: false
            referencedRelation: "grupo_ndp"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_setores_grupos_ndp_setores_id_setores_id"
            columns: ["setores_id"]
            isOneToOne: false
            referencedRelation: "setores"
            referencedColumns: ["id"]
          },
        ]
      }
      slide_options: {
        Row: {
          bubble_id: string | null
          created_at: string
          created_by: string | null
          descricao: string | null
          empresa: string | null
          id: string
          image: string | null
          titulo: string | null
          updated_at: string
        }
        Insert: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          empresa?: string | null
          id?: string
          image?: string | null
          titulo?: string | null
          updated_at?: string
        }
        Update: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          empresa?: string | null
          id?: string
          image?: string | null
          titulo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_slide_options_empresa_empresa_id"
            columns: ["empresa"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitacoes: {
        Row: {
          atendida: boolean | null
          bubble_id: string | null
          colaborador_2: string | null
          concessionaria: string | null
          created_at: string
          created_by: string | null
          id: string
          nome: string | null
          text: string | null
          tipo: string | null
          updated_at: string
          user: string | null
        }
        Insert: {
          atendida?: boolean | null
          bubble_id?: string | null
          colaborador_2?: string | null
          concessionaria?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          nome?: string | null
          text?: string | null
          tipo?: string | null
          updated_at?: string
          user?: string | null
        }
        Update: {
          atendida?: boolean | null
          bubble_id?: string | null
          colaborador_2?: string | null
          concessionaria?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          nome?: string | null
          text?: string | null
          tipo?: string | null
          updated_at?: string
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_solicitacoes_concessionaria_concessionaria_id"
            columns: ["concessionaria"]
            isOneToOne: false
            referencedRelation: "concessionaria"
            referencedColumns: ["id"]
          },
        ]
      }
      xr_acao: {
        Row: {
          bubble_id: string | null
          completa: boolean | null
          created_at: string
          created_by: string | null
          data: string | null
          descricao: string | null
          empresa: string | null
          grupo: string | null
          id: string
          indicador: string | null
          preliminar: number | null
          responsaveis: string[]
          responsavel: string | null
          updated_at: string
        }
        Insert: {
          bubble_id?: string | null
          completa?: boolean | null
          created_at?: string
          created_by?: string | null
          data?: string | null
          descricao?: string | null
          empresa?: string | null
          grupo?: string | null
          id?: string
          indicador?: string | null
          preliminar?: number | null
          responsaveis?: string[]
          responsavel?: string | null
          updated_at?: string
        }
        Update: {
          bubble_id?: string | null
          completa?: boolean | null
          created_at?: string
          created_by?: string | null
          data?: string | null
          descricao?: string | null
          empresa?: string | null
          grupo?: string | null
          id?: string
          indicador?: string | null
          preliminar?: number | null
          responsaveis?: string[]
          responsavel?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_xr_acao_empresa_empresa_id"
            columns: ["empresa"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_xr_acao_grupo_grupo_id"
            columns: ["grupo"]
            isOneToOne: false
            referencedRelation: "grupo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_xr_acao_indicador_rr_indicadores_id"
            columns: ["indicador"]
            isOneToOne: false
            referencedRelation: "rr_indicadores"
            referencedColumns: ["id"]
          },
        ]
      }
      xr_ano_fiscal: {
        Row: {
          bubble_id: string | null
          created_at: string
          created_by: string | null
          end_date: string | null
          id: string
          start_date: string | null
          updated_at: string
        }
        Insert: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      xr_ano_fiscal_preliminares: {
        Row: {
          created_at: string
          xr_ano_fiscal_id: string
          xr_placar_id: string
        }
        Insert: {
          created_at?: string
          xr_ano_fiscal_id: string
          xr_placar_id: string
        }
        Update: {
          created_at?: string
          xr_ano_fiscal_id?: string
          xr_placar_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_xr_ano_fiscal_preliminares_xr_ano_fiscal_id_xr_ano_fiscal"
            columns: ["xr_ano_fiscal_id"]
            isOneToOne: false
            referencedRelation: "xr_ano_fiscal"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_xr_ano_fiscal_preliminares_xr_placar_id_xr_placar_id"
            columns: ["xr_placar_id"]
            isOneToOne: false
            referencedRelation: "xr_placar"
            referencedColumns: ["id"]
          },
        ]
      }
      xr_indicador_resultado: {
        Row: {
          bubble_id: string | null
          concessionaria: string | null
          created_at: string
          created_by: string | null
          empresa: string | null
          id: string
          indicador: string | null
          meta: string | null
          meta_simulador: string | null
          percentual: string | null
          pontos: string | null
          preliminar: string | null
          resultado: string | null
          updated_at: string
        }
        Insert: {
          bubble_id?: string | null
          concessionaria?: string | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          id?: string
          indicador?: string | null
          meta?: string | null
          meta_simulador?: string | null
          percentual?: string | null
          pontos?: string | null
          preliminar?: string | null
          resultado?: string | null
          updated_at?: string
        }
        Update: {
          bubble_id?: string | null
          concessionaria?: string | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          id?: string
          indicador?: string | null
          meta?: string | null
          meta_simulador?: string | null
          percentual?: string | null
          pontos?: string | null
          preliminar?: string | null
          resultado?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_xr_indicador_resultado_concessionaria_concessionaria_id"
            columns: ["concessionaria"]
            isOneToOne: false
            referencedRelation: "concessionaria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_xr_indicador_resultado_empresa_empresa_id"
            columns: ["empresa"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_xr_indicador_resultado_indicador_rr_indicadores_id"
            columns: ["indicador"]
            isOneToOne: false
            referencedRelation: "rr_indicadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_xr_indicador_resultado_preliminar_xr_placar_id"
            columns: ["preliminar"]
            isOneToOne: false
            referencedRelation: "xr_placar"
            referencedColumns: ["id"]
          },
        ]
      }
      xr_meta: {
        Row: {
          bubble_id: string | null
          color: string | null
          created_at: string
          created_by: string | null
          id: string
          nome: string | null
          updated_at: string
        }
        Insert: {
          bubble_id?: string | null
          color?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          nome?: string | null
          updated_at?: string
        }
        Update: {
          bubble_id?: string | null
          color?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          nome?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      xr_placar: {
        Row: {
          bubble_id: string | null
          created_at: string
          created_by: string | null
          data: string | null
          empresa: string | null
          id: string
          id_2: number | null
          updated_at: string
        }
        Insert: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          data?: string | null
          empresa?: string | null
          id?: string
          id_2?: number | null
          updated_at?: string
        }
        Update: {
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          data?: string | null
          empresa?: string | null
          id?: string
          id_2?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_xr_placar_empresa_empresa_id"
            columns: ["empresa"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      xr_placar_indicadores: {
        Row: {
          created_at: string
          rr_indicadores_id: string
          xr_placar_id: string
        }
        Insert: {
          created_at?: string
          rr_indicadores_id: string
          xr_placar_id: string
        }
        Update: {
          created_at?: string
          rr_indicadores_id?: string
          xr_placar_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_xr_placar_indicadores_rr_indicadores_id_rr_indicadores_id"
            columns: ["rr_indicadores_id"]
            isOneToOne: false
            referencedRelation: "rr_indicadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_xr_placar_indicadores_xr_placar_id_xr_placar_id"
            columns: ["xr_placar_id"]
            isOneToOne: false
            referencedRelation: "xr_placar"
            referencedColumns: ["id"]
          },
        ]
      }
      xr_placar_resultados: {
        Row: {
          created_at: string
          xr_indicador_resultado_id: string
          xr_placar_id: string
        }
        Insert: {
          created_at?: string
          xr_indicador_resultado_id: string
          xr_placar_id: string
        }
        Update: {
          created_at?: string
          xr_indicador_resultado_id?: string
          xr_placar_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_xr_placar_resultados_xr_indicador_resultado_id_xr_indicad"
            columns: ["xr_indicador_resultado_id"]
            isOneToOne: false
            referencedRelation: "xr_indicador_resultado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_xr_placar_resultados_xr_placar_id_xr_placar_id"
            columns: ["xr_placar_id"]
            isOneToOne: false
            referencedRelation: "xr_placar"
            referencedColumns: ["id"]
          },
        ]
      }
      xr_placar_resultados_finais: {
        Row: {
          created_at: string
          xr_placar_id: string
          xr_resultado_final_id: string
        }
        Insert: {
          created_at?: string
          xr_placar_id: string
          xr_resultado_final_id: string
        }
        Update: {
          created_at?: string
          xr_placar_id?: string
          xr_resultado_final_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_xr_placar_resultados_finais_xr_placar_id_xr_placar_id"
            columns: ["xr_placar_id"]
            isOneToOne: false
            referencedRelation: "xr_placar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_xr_placar_resultados_finais_xr_resultado_final_id_xr_resu"
            columns: ["xr_resultado_final_id"]
            isOneToOne: false
            referencedRelation: "xr_resultado_final"
            referencedColumns: ["id"]
          },
        ]
      }
      xr_resultado_final: {
        Row: {
          bubble_id: string | null
          classificacao: string | null
          concessionaria: string | null
          created_at: string
          created_by: string | null
          empresa: string | null
          id: string
          id_2: string | null
          meta: string | null
          pontos: number | null
          preliminar: string | null
          updated_at: string
          year: number | null
        }
        Insert: {
          bubble_id?: string | null
          classificacao?: string | null
          concessionaria?: string | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          id?: string
          id_2?: string | null
          meta?: string | null
          pontos?: number | null
          preliminar?: string | null
          updated_at?: string
          year?: number | null
        }
        Update: {
          bubble_id?: string | null
          classificacao?: string | null
          concessionaria?: string | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          id?: string
          id_2?: string | null
          meta?: string | null
          pontos?: number | null
          preliminar?: string | null
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_xr_resultado_final_concessionaria_concessionaria_id"
            columns: ["concessionaria"]
            isOneToOne: false
            referencedRelation: "concessionaria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_xr_resultado_final_empresa_empresa_id"
            columns: ["empresa"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_xr_resultado_final_preliminar_xr_placar_id"
            columns: ["preliminar"]
            isOneToOne: false
            referencedRelation: "xr_placar"
            referencedColumns: ["id"]
          },
        ]
      }
      xr_simulador: {
        Row: {
          bubble_id: string | null
          concessionaria: string | null
          created_at: string
          created_by: string | null
          id: string
          meta: string | null
          ndp_competencia: number | null
          updated_at: string
          xr_indicador: string | null
        }
        Insert: {
          bubble_id?: string | null
          concessionaria?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          meta?: string | null
          ndp_competencia?: number | null
          updated_at?: string
          xr_indicador?: string | null
        }
        Update: {
          bubble_id?: string | null
          concessionaria?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          meta?: string | null
          ndp_competencia?: number | null
          updated_at?: string
          xr_indicador?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_xr_simulador_concessionaria_concessionaria_id"
            columns: ["concessionaria"]
            isOneToOne: false
            referencedRelation: "concessionaria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_xr_simulador_xr_indicador_rr_indicadores_id"
            columns: ["xr_indicador"]
            isOneToOne: false
            referencedRelation: "rr_indicadores"
            referencedColumns: ["id"]
          },
        ]
      }
      xr_simulador_acoes: {
        Row: {
          created_at: string
          xr_acao_id: string
          xr_simulador_id: string
        }
        Insert: {
          created_at?: string
          xr_acao_id: string
          xr_simulador_id: string
        }
        Update: {
          created_at?: string
          xr_acao_id?: string
          xr_simulador_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_xr_simulador_acoes_xr_acao_id_xr_acao_id"
            columns: ["xr_acao_id"]
            isOneToOne: false
            referencedRelation: "xr_acao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_xr_simulador_acoes_xr_simulador_id_xr_simulador_id"
            columns: ["xr_simulador_id"]
            isOneToOne: false
            referencedRelation: "xr_simulador"
            referencedColumns: ["id"]
          },
        ]
      }
      xr_tipo_indicador: {
        Row: {
          ativo: string | null
          bubble_id: string | null
          created_at: string
          created_by: string | null
          empresa: string | null
          id: string
          nome: string | null
          updated_at: string
        }
        Insert: {
          ativo?: string | null
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          id?: string
          nome?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: string | null
          bubble_id?: string | null
          created_at?: string
          created_by?: string | null
          empresa?: string | null
          id?: string
          nome?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_xr_tipo_indicador_empresa_empresa_id"
            columns: ["empresa"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      placar_indicator_summary: {
        Row: {
          colaborador_count: number | null
          indicador_count: number | null
          indicadores_com_valor: number | null
          placar_id: string | null
          total_pontos: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_indicadores_placar_placar_id"
            columns: ["placar_id"]
            isOneToOne: false
            referencedRelation: "placar"
            referencedColumns: ["id"]
          },
        ]
      }
      placar_ranking_summary: {
        Row: {
          colaborador_nome: string | null
          colaborador_user: string | null
          placar_id: string | null
          pontos_total: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_indicadores_placar_placar_id"
            columns: ["placar_id"]
            isOneToOne: false
            referencedRelation: "placar"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      can_access_concessionaria: {
        Args: { p_concessionaria_id: string }
        Returns: boolean
      }
      can_access_grupo: { Args: { p_grupo_id: string }; Returns: boolean }
      can_access_setor: { Args: { p_setor_id: string }; Returns: boolean }
      current_profile_id: { Args: never; Returns: string }
      current_profile_level: { Args: never; Returns: number }
      get_placar_ranking: {
        Args: { p_placar_id: string }
        Returns: {
          colaborador_nome: string
          colaborador_user: string
          pontos_total: number
          posicao: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
