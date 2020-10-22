Hooks:Install('Soldier:Damage', 100, function(hookCtx, soldier, info, giverInfo)
    NetEvents:SendToLocal('hit', giverInfo.giver, info.damage, info.boneIndex == 1, soldier.transform)
    hookCtx:Pass(soldier, info, giverInfo)
end)
