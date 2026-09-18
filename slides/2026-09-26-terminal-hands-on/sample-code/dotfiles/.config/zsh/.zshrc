# XDG Base Directory
export XDG_CONFIG_HOME="$HOME/.config"
export XDG_CACHE_HOME="$HOME/.cache"
export XDG_DATA_HOME="$HOME/.local/share"
export XDG_STATE_HOME="$HOME/.local/state"

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

# Ctrl-p / Ctrl-n を入力中の文字列で前方一致する履歴検索にする
autoload -Uz history-search-end
zle -N history-beginning-search-backward-end history-search-end
zle -N history-beginning-search-forward-end  history-search-end
bindkey '^p' history-beginning-search-backward-end
bindkey '^n' history-beginning-search-forward-end
