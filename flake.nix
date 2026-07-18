{
  inputs = {
    systems.url = "github:nix-systems/default";
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixpkgs-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
    treefmt-nix.url = "github:numtide/treefmt-nix";
  };

  outputs =
    inputs@{
      self,
      systems,
      nixpkgs,
      flake-parts,
      ...
    }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [
        inputs.treefmt-nix.flakeModule
      ];
      systems = import systems;

      perSystem =
        {
          config,
          system,
          ...
        }:
        let
          pkgs = import nixpkgs { inherit system; };
          # CI (pnpm/action-setup) と package.json の packageManager と同一バージョンに固定する
          pnpm = pkgs.pnpm.overrideAttrs (_: rec {
            version = "11.11.0";
            src = pkgs.fetchurl {
              url = "https://registry.npmjs.org/pnpm/-/pnpm-${version}.tgz";
              hash = "sha512-RGP2X9gO2A1pvB1L8WPulPYFxzgPwxi7Wy6+FfjNEtScUaTVnpUbQB52TTtsp1HL9RvFDtcAGmvLSTXmhMNIgg==";
            };
          });
        in
        {
          devShells.default = pkgs.mkShell {
            buildInputs = [
              # nixpkgs-unstable の nodejs デフォルト = 現行 Active LTS
              pkgs.nodejs
              pnpm
            ];

            shellHook = ''
              echo "🚀 Slidev dev environment ready"
              echo "  - node version: $(node --version)"
              echo "  - pnpm version: $(pnpm --version)"
            '';
          };

          treefmt = {
            projectRootFile = "flake.nix";
            programs = {
              nixfmt.enable = true;
              prettier.enable = true;
              actionlint.enable = true;
            };
          };
        };
    };
}
