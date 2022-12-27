{
  description = "Site para os resumos da universidade";
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs =
    { nixpkgs
    , flake-utils
    , ...
    }:
    flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      devShells.default = pkgs.mkShell {
        buildInputs = with pkgs;
          [
            jdk
            nodejs
            nodePackages.typescript-language-server
            nodePackages.vscode-langservers-extracted
            nodePackages.firebase-tools
            nodePackages.prettier
          ];
      };
    });
}
