export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
      calendar_category_tags: {
        Row: {
          category_name: string
          id: string
          person_who_owns_tag: string
          tag_color: string | null
        }
        Insert: {
          category_name: string
          id: string
          person_who_owns_tag: string
          tag_color?: string | null
        }
        Update: {
          category_name?: string
          id?: string
          person_who_owns_tag?: string
          tag_color?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_category_tags_person_who_owns_tag_fkey"
            columns: ["person_who_owns_tag"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
      classes_to_sections: {
        Row: {
          gen_class_id: string
          instructors: string[] | null
          section_id: string
          section_name: string
        }
        Insert: {
          gen_class_id: string
          instructors?: string[] | null
          section_id?: string
          section_name: string
        }
        Update: {
          gen_class_id?: string
          instructors?: string[] | null
          section_id?: string
          section_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_to_sections_gen_class_id_fkey"
            columns: ["gen_class_id"]
            isOneToOne: false
            referencedRelation: "university_to_classes"
            referencedColumns: ["class_id"]
          },
        ]
      }
      event: {
        Row: {
          description: string
          end_date: string
          end_repeat: string
          end_time: string
          id: string
          is_all_day: boolean
          location: string
          repeat: string
          special_event: boolean | null
          start_date: string
          start_time: string
          title: string
          weekdays: string[]
        }
        Insert: {
          description: string
          end_date: string
          end_repeat: string
          end_time: string
          id?: string
          is_all_day?: boolean
          location: string
          repeat?: string
          special_event?: boolean | null
          start_date: string
          start_time: string
          title: string
          weekdays: string[]
        }
        Update: {
          description?: string
          end_date?: string
          end_repeat?: string
          end_time?: string
          id?: string
          is_all_day?: boolean
          location?: string
          repeat?: string
          special_event?: boolean | null
          start_date?: string
          start_time?: string
          title?: string
          weekdays?: string[]
        }
        Relationships: []
      }
      follow_request: {
        Row: {
          created_at: string
          followed_id: string
          requester: string
        }
        Insert: {
          created_at?: string
          followed_id: string
          requester: string
        }
        Update: {
          created_at?: string
          followed_id?: string
          requester?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_request_followed_id_fkey"
            columns: ["followed_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_request_requester_fkey"
            columns: ["requester"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
      group_calendar_category_tags: {
        Row: {
          category_name: string | null
          group_tag_is_associated_with: string
          id: string
          tag_color: string
        }
        Insert: {
          category_name?: string | null
          group_tag_is_associated_with: string
          id?: string
          tag_color: string
        }
        Update: {
          category_name?: string | null
          group_tag_is_associated_with?: string
          id?: string
          tag_color?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_calendar_category_tags_group_tag_is_associated_with_fkey"
            columns: ["group_tag_is_associated_with"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["group_id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string | null
          group_id: string
          owner: string
          owner_invites: boolean
          profile_picture: string | null
          public_calendar: boolean
          public_special_events: boolean
          title: string
        }
        Insert: {
          created_at?: string | null
          group_id?: string
          owner: string
          owner_invites?: boolean
          profile_picture?: string | null
          public_calendar?: boolean
          public_special_events: boolean
          title: string
        }
        Update: {
          created_at?: string | null
          group_id?: string
          owner?: string
          owner_invites?: boolean
          profile_picture?: string | null
          public_calendar?: boolean
          public_special_events?: boolean
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_owner_fkey1"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
      groups_to_categories: {
        Row: {
          category_id: string
          group_id: string
        }
        Insert: {
          category_id: string
          group_id: string
        }
        Update: {
          category_id?: string
          group_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_to_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: true
            referencedRelation: "group_calendar_category_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groups_to_categories_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: true
            referencedRelation: "groups"
            referencedColumns: ["group_id"]
          },
        ]
      }
      invite_request: {
        Row: {
          created_at: string | null
          group_id: string
          requester: string
          user_to_invite: string
        }
        Insert: {
          created_at?: string | null
          group_id: string
          requester: string
          user_to_invite: string
        }
        Update: {
          created_at?: string | null
          group_id?: string
          requester?: string
          user_to_invite?: string
        }
        Relationships: [
          {
            foreignKeyName: "invite_request_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "invite_request_requester_fkey"
            columns: ["requester"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invite_request_user_to_invite_fkey"
            columns: ["user_to_invite"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
      join_request: {
        Row: {
          asker: string
          created_at: string
          group_id: string
        }
        Insert: {
          asker: string
          created_at?: string
          group_id: string
        }
        Update: {
          asker?: string
          created_at?: string
          group_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follwer_request_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "join_request_asker_fkey"
            columns: ["asker"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
      people_to_delete_added_group_events: {
        Row: {
          added_or_dropped: boolean
          event_id: string
          user_id: string
        }
        Insert: {
          added_or_dropped: boolean
          event_id: string
          user_id: string
        }
        Update: {
          added_or_dropped?: boolean
          event_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "people_to_delete_added_group_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_to_delete_added_group_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
      people_to_following: {
        Row: {
          followed_id: string
          follower_id: string
        }
        Insert: {
          followed_id: string
          follower_id: string
        }
        Update: {
          followed_id?: string
          follower_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "people-to-following_followed_id_fkey"
            columns: ["followed_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people-to-following_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
      people_to_group: {
        Row: {
          group_id: string
          person_id: string
          public_on_calendar: boolean
          show_on_calendar: boolean
        }
        Insert: {
          group_id: string
          person_id: string
          public_on_calendar?: boolean
          show_on_calendar?: boolean
        }
        Update: {
          group_id?: string
          person_id?: string
          public_on_calendar?: boolean
          show_on_calendar?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "people_to_group_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "people_to_group_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_to_group_person_id_fkey1"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
      people_to_sections: {
        Row: {
          section_id: string
          user_id: string
        }
        Insert: {
          section_id?: string
          user_id?: string
        }
        Update: {
          section_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "people_to_sections_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "classes_to_sections"
            referencedColumns: ["section_id"]
          },
          {
            foreignKeyName: "people_to_sections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
      people_to_university: {
        Row: {
          person_id: string
          public_on_calendar: boolean
          school_email: string | null
          show_on_calendar: boolean
          university_id: number
          verified_member: boolean | null
          YOG: string | null
        }
        Insert: {
          person_id: string
          public_on_calendar?: boolean
          school_email?: string | null
          show_on_calendar?: boolean
          university_id: number
          verified_member?: boolean | null
          YOG?: string | null
        }
        Update: {
          person_id?: string
          public_on_calendar?: boolean
          school_email?: string | null
          show_on_calendar?: boolean
          university_id?: number
          verified_member?: boolean | null
          YOG?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "people_to_university_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: true
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_to_university_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "university"
            referencedColumns: ["id"]
          },
        ]
      }
      people_to_viewership_tag: {
        Row: {
          owner_id: string
          person_asscoiated: string
          viewership_tag: string
        }
        Insert: {
          owner_id: string
          person_asscoiated: string
          viewership_tag: string
        }
        Update: {
          owner_id?: string
          person_asscoiated?: string
          viewership_tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "people_to_viewership_tag_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_to_viewership_tag_person_asscoiated_fkey"
            columns: ["person_asscoiated"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_to_viewership_tag_viewership_tag_fkey"
            columns: ["viewership_tag"]
            isOneToOne: false
            referencedRelation: "viewership_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      post: {
        Row: {
          created_at: string
          description: string | null
          event_id: string | null
          id: string
          imageLinks: string[] | null
          inspired_by_count: number
          liked_count: number
          owner_id: string
          todo_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          imageLinks?: string[] | null
          inspired_by_count?: number
          liked_count?: number
          owner_id: string
          todo_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          imageLinks?: string[] | null
          inspired_by_count?: number
          liked_count?: number
          owner_id?: string
          todo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_todo_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "todo"
            referencedColumns: ["id"]
          },
        ]
      }
      post_to_category: {
        Row: {
          category_id: string
          post_id: string
        }
        Insert: {
          category_id: string
          post_id: string
        }
        Update: {
          category_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_to_category_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "calendar_category_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_to_category_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
        ]
      }
      post_to_group_category: {
        Row: {
          category_id: string
          post_id: string
        }
        Insert: {
          category_id: string
          post_id: string
        }
        Update: {
          category_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_to_group_category_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "calendar_category_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_to_group_category_category_id_fkey1"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "group_calendar_category_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_to_group_category_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_to_group_category_post_id_fkey1"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
        ]
      }
      post_to_viewership_tags: {
        Row: {
          post_id: string
          vt_id: string
        }
        Insert: {
          post_id: string
          vt_id: string
        }
        Update: {
          post_id?: string
          vt_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_to_viewership_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_to_viewership_tags_vt_id_fkey"
            columns: ["vt_id"]
            isOneToOne: false
            referencedRelation: "viewership_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      sections_to_events: {
        Row: {
          adds_minus_deletes: number
          event_id: string
          is_default: boolean | null
          section_id: string
          special_event: boolean
        }
        Insert: {
          adds_minus_deletes?: number
          event_id?: string
          is_default?: boolean | null
          section_id?: string
          special_event?: boolean
        }
        Update: {
          adds_minus_deletes?: number
          event_id?: string
          is_default?: boolean | null
          section_id?: string
          special_event?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "sections_to_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sections_to_events_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "classes_to_sections"
            referencedColumns: ["section_id"]
          },
        ]
      }
      todo: {
        Row: {
          assigned_by: string | null
          date_due: string
          deadline: string | null
          id: string
          notes: string | null
          person_id: string | null
          title: string
        }
        Insert: {
          assigned_by?: string | null
          date_due: string
          deadline?: string | null
          id?: string
          notes?: string | null
          person_id?: string | null
          title: string
        }
        Update: {
          assigned_by?: string | null
          date_due?: string
          deadline?: string | null
          id?: string
          notes?: string | null
          person_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "todo_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
      todo_to_category: {
        Row: {
          category_id: string
          todo_id: string
        }
        Insert: {
          category_id: string
          todo_id: string
        }
        Update: {
          category_id?: string
          todo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todo_to_category_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "calendar_category_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_to_category_category_id_fkey1"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "calendar_category_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_to_category_post_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_to_category_todo_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "todo"
            referencedColumns: ["id"]
          },
        ]
      }
      university: {
        Row: {
          created_at: string
          id: number
          location: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          location?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          location?: string | null
        }
        Relationships: []
      }
      university_to_classes: {
        Row: {
          class_id: string
          class_name: string
          university_id: string
        }
        Insert: {
          class_id?: string
          class_name: string
          university_id: string
        }
        Update: {
          class_id?: string
          class_name?: string
          university_id?: string
        }
        Relationships: []
      }
      usersettings: {
        Row: {
          bio: string | null
          birthday: string | null
          clear_search_history_in: number
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          links: string[] | null
          manually_approve_tags: boolean | null
          middle_name: string | null
          public_or_private: boolean | null
          username: string | null
        }
        Insert: {
          bio?: string | null
          birthday?: string | null
          clear_search_history_in?: number
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          links?: string[] | null
          manually_approve_tags?: boolean | null
          middle_name?: string | null
          public_or_private?: boolean | null
          username?: string | null
        }
        Update: {
          bio?: string | null
          birthday?: string | null
          clear_search_history_in?: number
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          links?: string[] | null
          manually_approve_tags?: boolean | null
          middle_name?: string | null
          public_or_private?: boolean | null
          username?: string | null
        }
        Relationships: []
      }
      viewership_tags: {
        Row: {
          group_id: string | null
          id: string
          owner_id: string | null
          tag_color: string
          tag_name: string
        }
        Insert: {
          group_id?: string | null
          id?: string
          owner_id?: string | null
          tag_color: string
          tag_name?: string
        }
        Update: {
          group_id?: string | null
          id?: string
          owner_id?: string | null
          tag_color?: string
          tag_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "viewership_tags_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "viewership_tags_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "usersettings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_view_post: {
        Args: { post_id: string }
        Returns: boolean
      }
      can_view_post_definer: {
        Args: { post_id: string }
        Returns: boolean
      }
      can_view_post_invoker: {
        Args: { post_id: string }
        Returns: boolean
      }
      is_following: {
        Args: { follower: string; followed: string }
        Returns: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
