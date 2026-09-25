# XDG Base Directory
export XDG_CONFIG_HOME="$HOME/.config"
export XDG_CACHE_HOME="$HOME/.cache"
export XDG_DATA_HOME="$HOME/.local/share"
export XDG_STATE_HOME="$HOME/.local/state"

# エディタ (Esc→e の edit-command-line などが使う)
export EDITOR=nvim

# man をカラー表示 (nvim)
export MANPAGER='nvim +Man!'
# man をカラー表示 (vim の場合)
# export MANPAGER='vim -M +MANPAGER -'

# フロー制御を無効化 (Ctrl+q / Ctrl+s を解放)
stty -ixon

# Ctrl-x Ctrl-r で redo (undo しすぎた時に戻る)
bindkey '^X^R' redo

# Esc→e で現在行を $EDITOR で編集
autoload -Uz edit-command-line
zle -N edit-command-line
bindkey '^[e' edit-command-line

# Esc→, で Esc→. (insert-last-word) の 1 つ手前の単語に差し替える
autoload -Uz copy-earlier-word
zle -N copy-earlier-word
bindkey '^[,' copy-earlier-word

# プロンプト: ディレクトリ + git ブランチ + 終了コードで色が変わる ❯ (外部ツール不要)
autoload -Uz vcs_info
precmd() { vcs_info }
zstyle ':vcs_info:git:*' formats ' %F{yellow}(%b)%f'
setopt PROMPT_SUBST
PROMPT='%F{blue}%~%f${vcs_info_msg_0_} '
PROMPT+='%(?.%F{green}.%F{red})❯%f '

# Ctrl-p / Ctrl-n を入力中の文字列で前方一致する履歴検索にする
autoload -Uz history-search-end
zle -N history-beginning-search-backward-end history-search-end
zle -N history-beginning-search-forward-end  history-search-end
bindkey '^p' history-beginning-search-backward-end
bindkey '^n' history-beginning-search-forward-end
