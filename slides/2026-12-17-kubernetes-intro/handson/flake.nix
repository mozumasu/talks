{
  # Kubernetes 入門のハンズオン (04・05 章) で使うツール一式。
  # 手元にファイルを置かずに、次のコマンドでこの flake のシェルに入る:
  #   nix develop "github:mozumasu/talks?dir=slides/2026-12-17-kubernetes-intro/handson"
  description = "Kubernetes 入門ハンズオンの devShell (kind, kubectl, kubeswitch)";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
        isDarwin = pkgs.stdenv.hostPlatform.isDarwin;
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.kind # クラスターを作る
            pkgs.kubectl
            pkgs.kubeswitch # 向き先の切り替え (コマンドは switcher。switch はシェルの関数)
            pkgs.docker-client # kind が Node のコンテナを作るのに使う
          ]
          # macOS には Docker の本体が無いので、Docker Desktop を入れていない人は colima で VM を立てる
          ++ pkgs.lib.optionals isDarwin [ pkgs.colima ];

          # switch はシェルの関数として読み込む必要がある (nix develop のシェルは bash)
          shellHook = ''
            source <(switcher init bash)
            echo "Kubernetes ハンズオンの環境に入りました"
            echo "  kind:    $(kind version)"
            echo "  kubectl: $(kubectl version --client | head -n 1)"
            if ! docker info >/dev/null 2>&1; then
              echo "  Docker が動いていません。Docker Desktop を起動するか、colima start を実行してください"
            fi
          '';
        };
      }
    );
}
