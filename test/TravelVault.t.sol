// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/TravelVault.sol";

contract TravelVaultTest is Test {
    TravelVault vault;

    // Sahte kullanıcılar yaratıyoruz
    address owner = address(0x1);
    address agent = address(0x2);
    address airline = address(0x3);

    function setUp() public {
        // Her testten önce çalışır
        vm.prank(owner); // Owner kılığına gir
        vault = new TravelVault(agent);
    }

    function testDeposit() public {
        vm.deal(owner, 10 ether); // Owner'a sanal para ver

        vm.prank(owner); // İşlemi owner yapıyor
        vault.depositBudget{value: 1 ether}();

        assertEq(address(vault).balance, 1 ether);
    }

    function testAgentPurchase() public {
        // 1. Kasaya para koy
        vm.deal(owner, 5 ether);
        vm.prank(owner);
        vault.depositBudget{value: 2 ether}();

        // 2. Ajan olarak satın alma emri ver
        vm.prank(agent); // Artık ajanız
        vault.executePurchase(payable(airline), 1 ether, "TK-1923");

        // 3. Kontrol et: Havayolu parasını aldı mı?
        assertEq(airline.balance, 1 ether);
        // 4. Kontrol et: Kasa azaldı mı?
        assertEq(address(vault).balance, 1 ether);
    }

    function test_RevertWhen_UnauthorizedPurchase() public {
        // Yetkisiz biri (airline) satın alma yapmaya çalışırsa hata dönmeli
        vm.expectRevert();
        vm.prank(airline);
        vault.executePurchase(payable(airline), 1 ether, "HACK-TRY");
    }
}
